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

var consequenceTypeDetails = consequenceTypeTreeFormat(consequenceTypeDetails);


var consequenceTypes = {
    default:[
        consequenceTypeDetails['intergenic_variant']
    ],
    78 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['initiator_codon_variant'],
                        consequenceTypeDetails['stop_retained_variant'],
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']
            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ],
    81 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['protein_altering_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['start_lost'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['stop_retained_variant']
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']

            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ],
    82 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['protein_altering_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['start_lost'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['stop_retained_variant']
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']

            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ],
    86 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['protein_altering_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['start_lost'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['stop_retained_variant']
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']

            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ],
    87 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['protein_altering_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['start_lost'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['stop_retained_variant']
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']

            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ],

    89 : [
        {
            name: 'Transcript Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                {
                    name: 'Coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['coding_sequence_variant'],
                        consequenceTypeDetails['feature_elongation'],
                        consequenceTypeDetails['feature_truncation'],
                        consequenceTypeDetails['frameshift_variant'],
                        consequenceTypeDetails['incomplete_terminal_codon_variant'],
                        consequenceTypeDetails['inframe_deletion'],
                        consequenceTypeDetails['inframe_insertion'],
                        consequenceTypeDetails['missense_variant'],
                        consequenceTypeDetails['NMD_transcript_variant'],
                        consequenceTypeDetails['protein_altering_variant'],
                        consequenceTypeDetails['synonymous_variant'],
                        consequenceTypeDetails['start_lost'],
                        consequenceTypeDetails['stop_gained'],
                        consequenceTypeDetails['stop_lost'],
                        consequenceTypeDetails['stop_retained_variant']
                    ]
                },
                {

                    name: 'Non-coding Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['3_prime_UTR_variant'],
                        consequenceTypeDetails['5_prime_UTR_variant'],
                        consequenceTypeDetails['intron_variant'],
                        consequenceTypeDetails['non_coding_transcript_exon_variant'],
                        consequenceTypeDetails['non_coding_transcript_variant']
                    ]

                },
                {

                    name: 'Splice Variant',
                    cls: "parent",
                    leaf: false,
                    iconCls: 'no-icon',
                    expanded: true,
                    checked: false,
                    children: [
                        consequenceTypeDetails['splice_acceptor_variant'],
                        consequenceTypeDetails['splice_donor_variant'],
                        consequenceTypeDetails['splice_region_variant']
                    ]

                },
                consequenceTypeDetails['transcript_ablation'],
                consequenceTypeDetails['transcript_amplification']

            ]

        },
        {
            name: 'Regulatory Variant ',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['mature_miRNA_variant'],
                consequenceTypeDetails['regulatory_region_ablation'],
                consequenceTypeDetails['regulatory_region_amplification'],
                consequenceTypeDetails['regulatory_region_variant'],
                consequenceTypeDetails['TF_binding_site_variant'],
                consequenceTypeDetails['TFBS_ablation'],
                consequenceTypeDetails['TFBS_amplification']
            ]
        },
        {
            name: 'Intergenic Variant',
            cls: "parent",
            expanded: true,
            leaf: false,
            checked: false,
            iconCls: 'no-icon',
            children: [
                consequenceTypeDetails['downstream_gene_variant'],
                consequenceTypeDetails['intergenic_variant'],
                consequenceTypeDetails['upstream_gene_variant']
            ]
        }
    ]
};


function consequenceTypeTreeFormat(data){
    _.each(_.keys(data), function (key) {
        _.extend(data[key], {leaf: true, checked: false, iconCls: 'no-icon'})
    }, data);
    return data;
};

function getMostSevereConsequenceType(values) {
    var tempArray = [];
    var consequenceTypes = values;

    _.each(_.keys(consequenceTypes), function (key) {
       if(_.isUndefined(this[key].soTerms)) {
           tempArray.push(this[key].soName)
       } else {
           var so_terms = this[key].soTerms;
           _.each(_.keys(so_terms), function (key) {
               tempArray.push(this[key].soName)
           }, so_terms);
       }
    }, consequenceTypes);

    var groupedArr = _.groupBy(tempArray);
    var so_array = [];

    _.each(_.keys(groupedArr), function (key) {
        var index = _.indexOf(_.keys(consequenceTypeDetails), key);
        if (index < 0) {
            so_array.push(key)
        } else {
            so_array[index] = key;
        }
    }, groupedArr);
    so_array = _.compact(so_array);

    return so_array;
}

function getProteinSubstitutionScore(consequenceTypes,so_array,source) {
    var score = '-';
    var score_array = [];
    for (var i = 0; i < consequenceTypes.length; i++) {
        for (var j = 0; j < consequenceTypes[i].soTerms.length; j++) {
            if (consequenceTypes[i].soTerms[j].soName == _.first(so_array)) {
                _.each(_.keys(consequenceTypes[i].proteinSubstitutionScores), function (key) {
                    score = _.findWhere(this, {source: source}).score
                }, consequenceTypes[i].proteinSubstitutionScores);
            }
        }
    }
    if (!_.isEmpty(score_array)) {
        score = Math.min.apply(Math, score_array)
    }

    return score;
}