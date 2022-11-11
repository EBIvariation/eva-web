/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2019 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var config = require('./config.js');
config.loadModules();

module.exports = {

    runTableTestNew: function (sectionName, testName, element, elementID, expectedResults, checkFunction) {
        test.describe(sectionName, function () {
            test.it(testName, function () {
                var tableToFind = "//" + element + "[@id='" + elementID + "']";
                driver.wait(until.elementLocated(By.id(elementID)), config.wait()).then(async function (text) {
                    var noOfRows = expectedResults.length;
                    var keyList = Object.keys(expectedResults[0]);
                    var noOfCols = keyList.length;
                    var tableData = new Array();
                    for (rowNo = 1; rowNo <= noOfRows; rowNo++) {
                        var tableRow = {}
                        for (colNo = 1; colNo <= noOfCols; colNo++) {
                            var pathToElement = tableToFind + "//tr[" + rowNo + "]" + "//td[" + colNo + "]";
                            tableRow[keyList[colNo - 1]] = await driver.findElement(By.xpath(pathToElement)).getText();
                        }
                        tableData.push(tableRow);
                    }

                    for (i = 0; i < expectedResults.length; i++) {
                        found = false;
                        for (j = 0; j < tableData.length; j++) {
                            if (JSON.stringify(expectedResults[i]) === JSON.stringify(tableData[j])) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            throw JSON.stringify(expectedResults[i]) + 'not found in table'
                        }
                    }
                });
            });
        });
    },

    runTableTest: function (sectionName, testName, element, elementID, expectedResults, checkFunction) {
        test.describe(sectionName, function () {
            test.it(testName, function () {
                var rowIndex = 1;
                expectedResults.forEach(function(expectedResult) {
                    var colIndex = 1;
                    for (var expectedResultKey in expectedResult) {
                        checkFunction(driver, element, elementID, rowIndex, colIndex, expectedResult[expectedResultKey]);
                        colIndex += 1;
                    }
                    rowIndex += 1;
                });
            });
        });
    },

    checkSection: function(driver, element, elementID, rowIndex, colIndex, expectedValue) {
        var tableToFind = "//" + element + "[@id='" + elementID + "']";
        var pathToElement = tableToFind + "//tr[" + rowIndex + "]" + "//td[" + colIndex + "]";
        driver.wait(until.elementLocated(By.id(elementID)), config.wait()).then(function(text) {
            driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
                assert(text).equalTo(expectedValue);
            });
        });
        return driver;
    },

    checkGenotypeGrid: function(driver, element, elementID, rowIndex, colIndex, expectedValue) {
        var divToFind = "//" + element + "[@id='" + elementID + "']";
        var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + colIndex + "]//div";
        driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
            driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
                assert(text).equalTo(expectedValue);
            });
        });
        return driver;
    },

    checkPopulationStatsGrid: function(driver, element, elementID, rowIndex, colIndex, expectedValue) {
        var divToFind = "//" + element + "[@id='" + elementID + "']";
        var pathToElement = "(" + divToFind + "//table)[" + rowIndex + "]" + "//tr[1]//td[" + (colIndex + 1) + "]//div";
        driver.wait(until.elementLocated(By.xpath(pathToElement)), config.wait()).then(function(text) {
            driver.findElement(By.xpath(pathToElement)).getText().then(function(text){
                assert(text).equalTo(expectedValue);
            });
        });
        return driver;
    },

    checkElementContent: function(sectionName, testName, element, elementID, expectedValue) {
        test.describe(sectionName, function() {
            test.it(testName, function() {
                var elementToFind = "//" + element + "[@id='" + elementID + "']";
                driver.wait(until.elementLocated(By.xpath(elementToFind)), config.wait()).then(function(text) {
                    driver.findElement(By.xpath(elementToFind)).getText().then(function(text){
                        assert(text).equalTo(expectedValue);
                    });
                });
            });
        });
    },

    checkNoDataAvailable: function(sectionName, testName, element, elementID, expectedValue) {
        test.describe(sectionName, function() {
            test.it(testName, function() {
                var elementToFind = "//" + element + "[@id='" + elementID + "']//div[1]//span";
                driver.wait(until.elementLocated(By.xpath(elementToFind)), config.wait()).then(function(text) {
                    driver.findElement(By.xpath(elementToFind)).getText().then(function(text){
                        assert(text).equalTo(expectedValue);
                    });
                });
            });
        });
    }

}
