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
        var testObjectBefore = [{
            soTerms: [
                {
                    soName: "missense_variant",
                    soAccession: "SO:0001583"
                }
            ]
        },
        {
            soTerms: [
                {
                    soName: "5_prime_UTR_variant",
                    soAccession: "SO:0001623"
                }
            ]
        },
        {
            soTerms: [
                {
                    soName: "stop_lost",
                    soAccession: "SO:0001578"
                }
            ]
        }];

        it('should not return empty array', function(){
            expect(getMostSevereConsequenceType(testObjectBefore)).to.be.an('array').to.have.lengthOf(3);
        });
        it('should have consequecne Type array in most severe order ', function(){
            var expectedObjectAfter = ['stop_lost','missense_variant','5_prime_UTR_variant'];
            expect(getMostSevereConsequenceType(testObjectBefore)).to.deep.equal(expectedObjectAfter);
        });
    });

});

describe('Protein Substitution Score Tests', function(){
    var testObjectBefore = [{
        soTerms: [
            {
                soName: "stop_lost",
                soAccession: "SO:0001623"
            }
        ],
        proteinSubstitutionScores: [
            {
                score: 0.961,
                source: "Polyphen",
                description: "probably_damaging"
            },
            {
                score: 0.3,
                source: "Sift",
                description: "deleterious"
            }
        ]
    },
        {
            soTerms: [
                {
                    soName: "stop_lost",
                    soAccession: "SO:0001623"
                }
            ],
            proteinSubstitutionScores: [
                {
                    score: 0.981,
                    source: "Polyphen",
                    description: "probably_damaging"
                },
                {
                    score: 0.2,
                    source: "Sift",
                    description: "deleterious"
                }
            ]

        }];
    it('check Polyphen Score should be equal to 0.961', function(){
        var so_array = getMostSevereConsequenceType(testObjectBefore);
        expect(getProteinSubstitutionScore(testObjectBefore,so_array,'Polyphen')).to.deep.equal(0.981);
    });
    it('check Sift Score  should be equal to 0.2', function(){
        var so_array = getMostSevereConsequenceType(testObjectBefore);
        expect(getProteinSubstitutionScore(testObjectBefore,so_array,'Sift')).to.deep.equal(0.2);
    });
});

describe('Consequence Type Tree', function(){
    var conseqTypeFilter = new EvaConsequenceTypeFilterFormPanel();

    it('consequence Type tree with no parent should be rendered correctly', function () {
        var testObjectBefore = [ {
            name: 'coding_sequence_variant',
            acc:'SO:0001580',
            color: '#458B00',
            impact: 'MODIFIER',
            description:'A sequence variant that changes the coding sequence'
        }];

        var expectedObjectAfter = [ {
            name: 'coding_sequence_variant',
            acc:'SO:0001580',
            color: '#458B00',
            impact: 'MODIFIER',
            description:'A sequence variant that changes the coding sequence',
            leaf: true,
            checked: false,
            iconCls: "no-icon"
        }];

        expect(conseqTypeFilter._getConsequenceTypeTreeFormat(testObjectBefore)).to.deep.equal(expectedObjectAfter);
    });

    it('consequence Type tree with parents and children should be rendered correctly', function () {
        var testObjectBefore = [{
            name: 'Transcript Variant',
            children: [
                {
                    name: 'Coding Variant',
                    children: [
                        {   name: 'coding_sequence_variant',
                            acc:'SO:0001580',
                            color: '#458B00',
                            impact: 'MODIFIER',
                            description:'A sequence variant that changes the coding sequence'
                        }
                    ]
                },
                {
                    name: 'transcript_amplification',
                    acc:'SO:0001889',
                    color: '#FF69B4',
                    impact: 'HIGH',
                    description:'A feature amplification of a region containing a transcript'
                }
            ]

        }];

        var expectedObjectAfter = [{
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: "no-icon",
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    expanded: true,
                    leaf: false,
                    checked: false,
                    iconCls: "no-icon",
                    children: [
                        {   name: 'coding_sequence_variant',
                            acc:'SO:0001580',
                            color: '#458B00',
                            impact: 'MODIFIER',
                            description:'A sequence variant that changes the coding sequence',
                            leaf: true,
                            checked: false,
                            iconCls: "no-icon"
                        }
                    ]
                },
                {
                    name: 'transcript_amplification',
                    acc:'SO:0001889',
                    color: '#FF69B4',
                    impact: 'HIGH',
                    description:'A feature amplification of a region containing a transcript',
                    leaf: true,
                    checked: false,
                    iconCls: "no-icon"
                },


            ]
        }];

        expect(conseqTypeFilter._getConsequenceTypeTreeFormat(testObjectBefore)).to.deep.equal(expectedObjectAfter);
    });


});