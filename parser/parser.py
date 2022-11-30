import requests
from bs4 import BeautifulSoup


import requests
import urllib3
import ssl
import datetime

class CustomHttpAdapter (requests.adapters.HTTPAdapter):
    # "Transport adapter" that allows us to use custom ssl_context.

    def __init__(self, ssl_context=None, **kwargs):
        self.ssl_context = ssl_context
        super().__init__(**kwargs)

    def init_poolmanager(self, connections, maxsize, block=False):
        self.poolmanager = urllib3.poolmanager.PoolManager(
            num_pools=connections, maxsize=maxsize,
            block=block, ssl_context=self.ssl_context)


def get_legacy_session():
    ctx = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    ctx.options |= 0x4  # OP_LEGACY_SERVER_CONNECT
    session = requests.session()
    session.mount('https://', CustomHttpAdapter(ctx))
    return session

def create_post_body(tag):
    return f"term_in=202320&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj={tag}&sel_crse=&sel_title=&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a"

url = "https://banner.slu.edu/ssbprd/bwckschd.p_get_crse_unsec"
cookie = "NSC_wt_cboofs.tmv.fev_iuuqt_443=ffffffffa68e761745525d5f4f58455e445a4a42378b"
file_name = f"dump_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.sql"
print(file_name)

with open("setup.sql", "r") as o:
    setup = o.readlines()

with open(f'sql/{file_name}', "a+") as o:
    o.write("".join(setup))

for c in ["CSCI"]:
    r = get_legacy_session().post(url, headers={"Cookie":cookie}, data=create_post_body(c))
    soup = BeautifulSoup(r.text, "html.parser")
    trs = soup.find("table", class_="datadisplaytable").find_all("tr")

    i = 0
    while i+4 <= len(trs):
        title_tr, data_tr, label_tr, labeldata_tr = trs[i:i+4]

        course_title, course_id, course_tag, course_section = title_tr.find("a").text.split(" - ")
        course_id = int(course_id)
        # print(course_title)
        # print(course_id)
        # print(course_tag)
        # print(course_section)

        # test = [i.replace("\n", "") for i in str(data_tr.find("td")).split("</br>")]
        data_tr_list = [i.replace("\n", "") for i in data_tr.find("td").text.split("\n\n")]
        # print(data_tr_list)
        try:
            course_term = data_tr_list[0].split(": ")[1]
        except IndexError:
            data_tr_list = data_tr_list[1:]
            course_term = data_tr_list[0].split(": ")[1]
        # print(course_term)
        course_registration_dates = data_tr_list[1]
        # print(course_registration_dates)
        if (isinstance(course_registration_dates, str)):
            course_registration_start = None
            course_registration_end = None
        else:
            course_registration_dates = course_registration_dates.split(": ")[1].split(" to ")
            course_registration_start = course_registration_dates[0]
            course_registration_end = course_registration_dates[1]
        course_level = data_tr_list[2].split(": ")[1:]
        # print(course_level)
        
        if (data_tr_list[3][:10] == "Attributes"):
            course_attributes = data_tr_list[3].split(": ")[1].split(", ")
            # print(course_attributes)
            data_tr_rest = data_tr_list[4:]
        else:
            course_attributes = []
            data_tr_rest = data_tr_list[3:]
        # print(data_tr_rest)
        course_location = data_tr_rest[0]
        course_schedule_type = data_tr_rest[1]
        course_meetings = data_tr_rest[2]
        if len(data_tr_rest) < 10:
            course_credit = course_meetings
            course_meetings = None
        else:
            course_credits = data_tr_rest[3].replace("Credits", "").replace(" ", "")
        # print(course_credits)

        labeldata_list = labeldata_tr.find_all("td")
        meeting_type = labeldata_list[0].text
        # print(meeting_type)
        meeting_date = labeldata_list[1].text.split(" - ")
        meeting_date_start = meeting_date[0]
        meeting_date_end = meeting_date[1]
        # print(meeting_date_start)
        # print(meeting_date_end)
        meeting_time = labeldata_list[2].text.split(" - ")
        if len(meeting_time) < 2:
            meeting_date_start = None
            meeting_date_end = None
        else:
            meeting_time_start = meeting_time[0]
            meeting_time_end = meeting_time[1]
        # print(meeting_time_start)
        # print(meeting_time_end)
        # print([i.text for i in labeldata_list])
        meeting_days = labeldata_list[3].text
        if (meeting_days == "\xa0"):
            meeting_days = None
        # print(meeting_days)
        meeting_location = labeldata_list[4].text
        # print(meeting_location)
        meeting_schedule_type = labeldata_list[5].text
        # print(meeting_schedule_type)
        meeting_instructor = labeldata_list[6].text.replace(' (P)', '')
        meeting_instructor = ' '.join(meeting_instructor.split())
        # print(meeting_instructor)

        # inserting data
        course_object = {}
        course_object["CourseTitle"] = course_title
        course_object["CourseID"] = course_id
        course_object["CourseTag"] = course_tag
        course_object["CourseSection"] = course_section
        course_object["CourseTerm"] = course_term
        # course_object["CourseRegistrationStart"] = course_registration_start,
        # course_object["CourseRegistrationEnd"] = course_registration_end
        # course_object["CourseLevel"] = course_level
        # course_object["CourseAttributes"] = course_attributes
        course_object["CourseLocation"] = course_location
        course_object["CourseScheduleType"] = course_schedule_type
        course_object["CourseMeetings"] = course_meetings
        course_object["CourseCredits"] = course_credits
        
        meeting = {}
        meeting["MeetingType"] = meeting_type
        meeting["MeetingDateStart"] = meeting_date_start
        meeting["MeetingDateEnd"] = meeting_date_end
        meeting["MeetingTimeStart"] = meeting_time_start
        meeting["MeetingTimeEnd"] = meeting_time_end
        meeting["MeetingDays"] = meeting_days
        meeting["MeetingLocation"] = meeting_location
        meeting["MeetingScheduleType"] = meeting_schedule_type
        meeting["MeetingInstructor"] = meeting_instructor

        # print(f"course: {course_object}")
        # print(f"meeting: {meeting}")

        course_object = [f"\'{i}\'" if isinstance(i, str) else i for i in course_object.values() ]
        # print(course_object)
        temp = course_object[1]
        course_object[1] = course_object[0]
        course_object[0] = temp
        course_object = ["NULL" if not i else i for i in course_object]
        course_ps = f"insert into Courses values ({','.join([str(i) for i in course_object])});"

        meeting_object = [f"\'{i}\'" if isinstance(i, str) else i for i in meeting.values()]
        meeting_object = ["NULL" if not i else i for i in meeting_object]
        meeting_object.insert(0, course_id)
        meeting_ps = f"insert into Meetings values ({','.join([str(i) for i in meeting_object])});"
        # print(meeting_object)

        ps_attributes = []
        for attribute in course_attributes:
            ps_attributes.append(f"insert into CourseAttributes values ({course_id},'{attribute.strip()}');")
        attributes_ps = "\n".join(ps_attributes)

        ps_levels = []
        for level in course_level:
            ps_levels.append(f"insert into CourseLevels values ({course_id},'{level.strip()}');")
        levels_ps = "\n".join(ps_levels)

        # print(levels_ps)
        with open(f'sql/{file_name}', "a+") as o:
            o.write(f'{course_ps}\n{meeting_ps}\n{attributes_ps}\n{levels_ps}\n')

        i+=4
