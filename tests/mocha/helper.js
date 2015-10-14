
test = require('selenium-webdriver/testing'),
webdriver = require('selenium-webdriver'),
By = require('selenium-webdriver').By,
until = require('selenium-webdriver').until,
assert = require('selenium-webdriver/testing/assert'),
flow = webdriver.promise.controlFlow();

baseURL = 'http://wwwint.ebi.ac.uk/eva';

