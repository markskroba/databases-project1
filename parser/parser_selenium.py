from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from time import sleep 

url = "https://banner.slu.edu/ssbprd/bwckschd.p_disp_dyn_sched"

driver = webdriver.Firefox()
driver.get(url)
sleep(1)
form = driver.find_element(By.TAG_NAME, "form")
select = Select(driver.find_element(By.TAG_NAME, "select"))
select.select_by_visible_text("Spring 2023")
form.submit()
sleep(3)

# new page
options = []
form = driver.find_element(By.TAG_NAME, "form")
select = Select(driver.find_element(By.ID, "subj_id"))
for o in select.options:
	o = o.text
	print(o)
	options.append(o)
print(options)

# main event loop
for subject in options:
	select = Select(driver.find_element(By.ID, "subj_id"))
	form = driver.find_element(By.TAG_NAME, "form")
	select.select_by_visible_text(subject)
	form.submit()
	sleep(3)
	titles = driver.find_elements(By.CLASS_NAME, "ddtitle")
	for t in titles:
		t = t.find_element(By.TAG_NAME, "a")
		print(t.text)

	# driver.find_element(By.CLASS_NAME, "ntdefault").find_element(By.TAG_NAME, "a").click()
	# driver.navigate().back() = 
	driver.back()
	sleep(1)
	select = Select(driver.find_element(By.ID, "subj_id"))
	form = driver.find_element(By.TAG_NAME, "form")
	select.deselect_all()
	sleep(3)



sleep(10)
driver.close()