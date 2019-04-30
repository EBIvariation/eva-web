/*
 *
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014-2018 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var config = require('./config.js');
module.exports = {
assertAlertWindowShown: function (driver, message) {
    driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")), config.wait()).then(function (text) {
        driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//div[contains(@class,'x-component x-window-text x-box-item x-component-default')]")).getText().then(function (text) {
            assert(text).equalTo(message);
            driver.findElement(By.xpath("//div[contains(@class,'x-window x-message-box')]//span[contains(@class,'x-btn-inner x-btn-inner-default-small')]")).click();
        });
    });
}
}