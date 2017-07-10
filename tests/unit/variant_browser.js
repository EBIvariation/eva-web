/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2017 EMBL - European Bioinformatics Institute
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
var chai,expect = chai.expect, should = chai.should();

describe('Most Severe ConsquenceType Tests', function(){
    describe('getMostSevereConsequenceType() without any parameters', function(){
        it('should return  empty array', function(){
            expect(getMostSevereConsequenceType()).to.be.an('array').to.have.lengthOf(0);
        });
    });
    describe('getMostSevereConsequenceType(values)', function(){
        it('should not return emoty array', function(){
            expect(getMostSevereConsequenceType(conseqData)).to.be.an('array').to.have.lengthOf(3);
        });
        it('should have missense_variant as first element in the array ', function(){
            var consequenceType = getMostSevereConsequenceType(conseqData);
            consequenceType[0].should.equal('missense_variant');
        });
    });

});

describe('Protein Substitution Score Tests', function(){
    it('check Polyphen Score should be equal to 0.961', function(){
        var so_array = getMostSevereConsequenceType(conseqData);
        var polyphenScore = getProteinSubstitutionScore(conseqData,so_array,'Polyphen');
        expect(polyphenScore).to.deep.equal(0.961);
    });
    it('check Sift Score  should be equal to 0', function(){
        var so_array = getMostSevereConsequenceType(conseqData);
        var siftScore = getProteinSubstitutionScore(conseqData,so_array,'Sift');
        expect(siftScore).to.deep.equal(0);
    });
});

describe('Consequence Type Tree', function(){
    var conseqTypeFilter = new EvaConsequenceTypeFilterFormPanel({
        collapsed: true,
        fields: [
            {name: 'name', type: 'string'}
        ],
        columns: [
            {
                xtype: 'treecolumn',
                flex: 1,
                sortable: false,
                dataIndex: 'name'
            }
        ]
    });
    describe('check default tree', function(){
        it('should be equal to defaultConsqTree', function () {
            expect(conseqTypeFilter.getConsequenceTypeTree('default')[0]).to.deep.equal(defaultConsqTree[0]);
        });
    });

    describe('check verison 78 tree ', function() {
        it('should be equal to version78ConsqTree', function () {
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[0]).to.deep.equal(version78ConsqTree[0]);
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[1]).to.deep.equal(version78ConsqTree[1]);
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[2]).to.deep.equal(version78ConsqTree[2]);
        });
        it('should not be equal to version82ConsqTree', function () {
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[0]).to.not.equal(version82ConsqTree[0]);
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[1]).to.not.equal(version82ConsqTree[1]);
            expect(conseqTypeFilter.getConsequenceTypeTree('78')[2]).to.not.equal(version82ConsqTree[2]);
        });
    });

    describe('check version 82 ', function() {
        it('should be equal to version82ConsqTree', function(){
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[0]).to.deep.equal(version82ConsqTree[0]);
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[1]).to.deep.equal(version82ConsqTree[1]);
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[2]).to.deep.equal(version82ConsqTree[2]);
        });

        it('should not be equal to version78ConsqTree', function(){
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[0]).to.not.equal(version78ConsqTree[0]);
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[1]).to.not.equal(version78ConsqTree[1]);
            expect(conseqTypeFilter.getConsequenceTypeTree('82')[2]).to.not.equal(version78ConsqTree[2]);
        });
    });
});