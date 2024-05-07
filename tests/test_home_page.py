import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import pytest

@pytest.mark.usefixtures("setup")
class TestHomePage:

    def test_customer_id(self):
        expected_customer_id = "5042843"

        element = self.driver.find_element(By.XPATH,'//*[@id="root"]/div/div[2]/div[2]/h2')
        print(element.text)

        assert expected_customer_id == element.text


    def test_if_balance_invisible(self):
        expected_text = "******"

        element = self.driver.find_element(By.XPATH,'//*[@id="root"]/div/div[2]/div[2]/div[3]/h2')
        assert expected_text == element.text

    def test_iban_format(self):
        expected_digit = 23


    def test_swift_button(self):
        expected_header = "Money Transfer (SWIFT)"
        button = self.driver.find_element(By.CLASS_NAME,'text-green-800')
        button.click()
        actual_header = self.driver.find_element(By.XPATH,'//*[@id="root"]/div/div[1]/h1/em').text
        assert expected_header == actual_header

    def test_transaction_history_button(self):
        self.driver.get("http://localhost:5173/")
        expected_header = "Transaction History"
        button = self.driver.find_element(By.CLASS_NAME, 'text-yellow-600')
        button.click()
        actual_header = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[1]/h1/em').text
        assert expected_header == actual_header
    def test_money_transfer_button(self):
        self.driver.get("http://localhost:5173/")
        expected_header = "Money Transfer (EFT/HAVALE/FAST)"
        button = self.driver.find_element(By.CLASS_NAME, 'text-red-600')
        button.click()
        actual_header = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[1]/h1/em').text
        assert expected_header == actual_header

    def test_create_account_button(self):
        self.driver.get("http://localhost:5173/")
        expected_header = "Invesment Account"
        button = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[2]/div[2]/div[4]/a[4]')
        button.click()
        actual_header = self.driver.find_element(By.XPATH, '//*[@id="root"]/div/div[1]/h1/em').text
        assert expected_header == actual_header

