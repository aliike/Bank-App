import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
# driver.maximize_window()
# driver.get("http://localhost:5173/")
# time.sleep(2)
# driver.quit()

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
driver.maximize_window()
driver.get("http://localhost:5173/")

element = driver.find_element(By.XPATH,'//*[@id="root"]/div/div[2]/div[2]/h2')
print(element.text)
