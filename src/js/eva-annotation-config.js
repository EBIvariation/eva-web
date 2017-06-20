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

consequenceTypesHierarchy = ['transcript_ablation',
    'splice_acceptor_variant',
    'splice_donor_variant',
    'stop_gained',
    'frameshift_variant',
    'stop_lost',
    'start_lost',
    'initiator_codon_variant',
    'transcript_amplification',
    'inframe_insertion',
    'inframe_deletion',
    'missense_variant',
    'protein_altering_variant',
    'splice_region_variant',
    'incomplete_terminal_codon_variant',
    'stop_retained_variant',
    'synonymous_variant',
    'coding_sequence_variant',
    'mature_miRNA_variant',
    '5_prime_UTR_variant',
    '3_prime_UTR_variant',
    'non_coding_transcript_exon_variant',
    'intron_variant',
    'NMD_transcript_variant',
    'non_coding_transcript_variant',
    'upstream_gene_variant',
    'downstream_gene_variant',
    'TFBS_ablation',
    'TFBS_amplification',
    'TF_binding_site_variant',
    'regulatory_region_ablation',
    'regulatory_region_amplification',
    'regulatory_region_variant',
    'feature_elongation',
    'feature_truncation',
    'intergenic_variant']

consequenceTypesInfo = [
    {id: 'transcript_ablation', color: '#FF0000', impact: 'HIGH', description:'A feature ablation whereby the deleted region includes a transcript feature'},
    {id: 'splice_acceptor_variant', color: '#FF581A', impact: 'HIGH', description:'A splice variant that changes the 2 base region at the 3\' end of an intron'},
    {id: 'splice_donor_variant', color: '#FF581A', impact: 'HIGH', description:'A splice variant that changes the 2 base region at the 5\' end of an intron'},
    {id: 'stop_gained', color: '#FF0000', impact: 'HIGH', description:'A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript'},
    {id: 'frameshift_variant', color: '#9400D3', impact: 'HIGH', description:'A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three'},
    {id: 'stop_lost', color: '#FF0000', impact: 'HIGH', description:'A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript'},
    {id: 'start_lost', color: '#FFD700', impact: 'HIGH', description:'A codon variant that changes at least one base of the canonical start codon'},
    {id: 'initiator_codon_variant',color:'#FF0000', impact: 'LOW', description:'A codon variant that changes at least one base of the first codon of a transcript'},
    {id: 'transcript_amplification', color: '#FF69B4', impact: 'HIGH', description:'A feature amplification of a region containing a transcript'},
    {id: 'inframe_insertion', color: '#FF69B4', impact: 'MODERATE', description:'An inframe non synonymous variant that inserts bases into in the coding sequence'},
    {id: 'inframe_deletion', color: '#FF69B4', impact: 'MODERATE', description:'An inframe non synonymous variant that deletes bases from the coding sequence'},
    {id: 'missense_variant', color: '#FFD700', impact: 'MODERATE', description:'A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved'},
    {id: 'protein_altering_variant', color: '#FF0080', impact: 'MODERATE', description:'A sequence_variant which is predicted to change the protein encoded in the coding sequence'},
    {id: 'splice_region_variant', color: '#FF7F50', impact: 'LOW', description:'A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron'},
    {id: 'incomplete_terminal_codon_variant', color: '#FF00FF', impact: 'LOW', description:'A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed'},
    {id: 'stop_retained_variant', color: '#76EE00', impact: 'LOW', description:'A sequence variant where at least one base in the terminator codon is changed, but the terminator remains'},
    {id: 'synonymous_variant', color: '#76EE00', impact: 'LOW', description:'A sequence variant where there is no resulting change to the encoded amino acid'},
    {id: 'coding_sequence_variant', color: '#458B00', impact: 'MODIFIER', description:'A sequence variant that changes the coding sequence'},
    {id: 'mature_miRNA_variant', color: '#458B00', impact: 'MODIFIER', description:'A transcript variant located with the sequence of the mature miRNA'},
    {id: '5_prime_UTR_variant', color: '#7AC5CD', impact: 'MODIFIER', description:'A UTR variant of the 5\' UTR'},
    {id: '3_prime_UTR_variant', color: '#7AC5CD', impact: 'MODIFIER', description:'A UTR variant of the 3\' UTR'},
    {id: 'non_coding_transcript_exon_variant', color: '#32CD32', impact: 'MODIFIER', description:'A sequence variant that changes non-coding exon sequence in a non-coding transcript'},
    {id: 'intron_variant', color: '#02599C', impact: 'MODIFIER', description:'A transcript variant occurring within an intron'},
    {id: 'NMD_transcript_variant', color: '#FF4500', impact: 'MODIFIER', description:'A variant in a transcript that is the target of NMD'},
    {id: 'non_coding_transcript_variant', color: '#32CD32', impact: 'MODIFIER', description:'A transcript variant of a non coding RNA gene'},
    {id: 'upstream_gene_variant', color: '#A2B5CD', impact: 'MODIFIER', description:'A sequence variant located 5\' of a gene'},
    {id: 'downstream_gene_variant', color: '#A2B5CD', impact: 'MODIFIER', description:'A sequence variant located 3\' of a gene'},
    {id: 'TFBS_ablation', color: '#A52A2A', impact: 'MODERATE', description:'A feature ablation whereby the deleted region includes a transcription factor binding site'},
    {id: 'TFBS_amplification', color: '#A52A2A', impact: 'MODIFIER', description:'A feature amplification of a region containing a transcription factor binding site'},
    {id: 'TF_binding_site_variant', color: '#A52A2A', impact: 'MODIFIER', description:'A sequence variant located within a transcription factor binding site'},
    {id: 'regulatory_region_ablation', color: '#A52A2A', impact: 'MODERATE', description:'A feature ablation whereby the deleted region includes a regulatory region'},
    {id: 'regulatory_region_amplification', color: '#A52A2A', impact: 'MODIFIER', description:'A feature amplification of a region containing a regulatory region'},
    {id: 'regulatory_region_variant', color: '#A52A2A', impact: 'MODIFIER', description:'A sequence variant located within a regulatory region'},
    {id: 'feature_elongation', color: '#7F7F7F', impact: 'MODIFIER', description:'A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence'},
    {id: 'feature_truncation', color: '#7F7F7F', impact: 'MODIFIER', description:'A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence'},
    {id: 'intergenic_variant', color: '#636363', impact: 'MODIFIER', description:'A sequence variant located in the intergenic region, between genes'}
];
var consequenceTypeDetails = {
    'transcript_ablation': {
        name: 'transcript_ablation',
        acc:'SO:0001893',
        color: '#FF0000',
        impact: 'HIGH',
        description:'A feature ablation whereby the deleted region includes a transcript feature'
    },
    'splice_acceptor_variant': {
        name: 'splice_acceptor_variant',
        acc:'SO:0001574',
        color: '#FF581A',
        impact: 'HIGH',
        description:'A splice variant that changes the 2 base region at the 3\' end of an intron'
    },
    'splice_donor_variant': {
        name: 'splice_donor_variant',
        acc:'SO:0001575',
        color: '#FF581A',
        impact: 'HIGH',
        description:'A splice variant that changes the 2 base region at the 5\' end of an intron'
    },
    'stop_gained': {
        name: 'stop_gained',
        acc:'SO:0001587',
        color: '#FF0000',
        impact: 'HIGH',
        description:'A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript'
    },
    'frameshift_variant': {
        name: 'frameshift_variant',
        acc: 'SO:0001589',
        color: '#9400D3',
        impact: 'HIGH',
        description:'A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three'
    },
    'stop_lost': {
        name: 'stop_lost',
        acc:'SO:0001578',
        color: '#FF0000',
        impact: 'HIGH',
        description:'A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript'
    },
    'start_lost':{
        name: 'start_lost',
        acc:'SO:0002012',
        color: '#FFD700',
        impact: 'HIGH',
        description:'A codon variant that changes at least one base of the canonical start codon'
    },
    'initiator_codon_variant': {
        name: 'initiator_codon_variant',
        acc:'SO:0001582',
        color:'#FF0000',
        impact: 'LOW',
        description:'A codon variant that changes at least one base of the first codon of a transcript'
    },
    'transcript_amplification': {
        name: 'transcript_amplification',
        acc:'SO:0001889',
        color: '#FF69B4',
        impact: 'HIGH',
        description:'A feature amplification of a region containing a transcript'
    },
    'inframe_insertion': {
        name: 'inframe_insertion',
        acc:'SO:0001821',
        color: '#FF69B4',
        impact: 'MODERATE',
        description:'An inframe non synonymous variant that inserts bases into in the coding sequence'
    },
    'inframe_deletion': {
        name: 'inframe_deletion',
        acc:'SO:0001822',
        color: '#FF69B4',
        impact: 'MODERATE',
        description:'An inframe non synonymous variant that deletes bases from the coding sequence'
    },
    'missense_variant': {
        name: 'missense_variant',
        acc:'SO:0001583',
        color: '#FFD700',
        impact: 'MODERATE',
        description:'A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved'
    },
    'protein_altering_variant': {
        name: 'protein_altering_variant',
        acc:'SO:0001818',
        color: '#FF0080',
        impact: 'MODERATE',
        description:'A sequence_variant which is predicted to change the protein encoded in the coding sequence'
    },
    'splice_region_variant' : {
        name: 'splice_region_variant',
        acc:'SO:0001630',
        color: '#FF7F50',
        impact: 'LOW',
        description:'A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron'
    },
    'incomplete_terminal_codon_variant' : {
        name: 'incomplete_terminal_codon_variant',
        acc:'SO:0001626',
        color: '#FF00FF',
        impact: 'LOW',
        description:'A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed'
    },
    'stop_retained_variant': {
        name: 'stop_retained_variant',
        acc:'SO:0001567',
        color: '#76EE00',
        impact: 'LOW',
        description:'A sequence variant where at least one base in the terminator codon is changed, but the terminator remains'
    },
    'synonymous_variant': {
        name: 'synonymous_variant',
        acc:'SO:0001819',
        color: '#76EE00',
        impact: 'LOW',
        description:'A sequence variant where there is no resulting change to the encoded amino acid'
    },
    'coding_sequence_variant': {
        name: 'coding_sequence_variant',
        acc:'SO:0001580',
        color: '#458B00',
        impact: 'MODIFIER',
        description:'A sequence variant that changes the coding sequence'
    },
    'mature_miRNA_variant': {
        name: 'mature_miRNA_variant',
        acc:'SO:0001620',
        color: '#458B00',
        impact: 'MODIFIER',
        description:'A transcript variant located with the sequence of the mature miRNA'
    },
    '5_prime_UTR_variant': {
        name: '5_prime_UTR_variant',
        acc:'SO:0001623',
        color: '#7AC5CD',
        impact: 'MODIFIER',
        description:'A UTR variant of the 5\' UTR'
    },
    '3_prime_UTR_variant':  {
        name: '3_prime_UTR_variant',
        acc:'SO:0001624',
        color: '#7AC5CD',
        impact: 'MODIFIER',
        description:'A UTR variant of the 3\' UTR'
    },
    'non_coding_transcript_exon_variant': {
        name: 'non_coding_transcript_exon_variant',
        acc:'SO:0001792',
        color: '#32CD32',
        impact: 'MODIFIER',
        description:'A sequence variant that changes non-coding exon sequence in a non-coding transcript'
    },
    'intron_variant': {
        name: 'intron_variant',
        acc:'SO:0001627',
        color: '#02599C',
        impact: 'MODIFIER',
        description:'A transcript variant occurring within an intron'
    },
    'NMD_transcript_variant': {
        name: 'NMD_transcript_variant',
        acc:'SO:0001621',
        color: '#FF4500',
        impact: 'MODIFIER',
        description:'A variant in a transcript that is the target of NMD'
    },
    'non_coding_transcript_variant': {
        name: 'non_coding_transcript_variant',
        acc:'SO:0001619',
        color: '#32CD32',
        impact: 'MODIFIER',
        description:'A transcript variant of a non coding RNA gene'
    },
    'upstream_gene_variant': {
        name: 'upstream_gene_variant',
        acc:'SO:0001631',
        color: '#A2B5CD',
        impact: 'MODIFIER',
        description:'A sequence variant located 5\' of a gene'
    },
    'downstream_gene_variant': {
        name: 'downstream_gene_variant',
        acc:'SO:0001632',
        color: '#A2B5CD',
        impact: 'MODIFIER',
        description:'A sequence variant located 3\' of a gene'
    },
    'TFBS_ablation': {
        name: 'TFBS_ablation',
        acc:'SO:0001895',
        color: '#A52A2A',
        impact: 'MODERATE',
        description:'A feature ablation whereby the deleted region includes a transcription factor binding site'
    },
    'TFBS_amplification': {
        name: 'TFBS_amplification',
        acc:'SO:0001892',
        color: '#A52A2A',
        impact: 'MODIFIER',
        description:'A feature amplification of a region containing a transcription factor binding site'
    },
    'TF_binding_site_variant': {
        name: 'TF_binding_site_variant',
        acc:'SO:0001782',
        color: '#A52A2A',
        impact: 'MODIFIER',
        description:'A sequence variant located within a transcription factor binding site'
    },
    'regulatory_region_ablation': {
        name: 'regulatory_region_ablation',
        acc:'SO:0001894',
        color: '#A52A2A',
        impact: 'MODERATE',
        description:'A feature ablation whereby the deleted region includes a regulatory region'
    },
    'regulatory_region_amplification': {
        name: 'regulatory_region_amplification',
        acc:'SO:0001891',
        color: '#A52A2A',
        impact: 'MODIFIER',
        description:'A feature amplification of a region containing a regulatory region'
    },
    'regulatory_region_variant': {
        name: 'regulatory_region_variant',
        acc:'SO:0001566',
        color: '#A52A2A',
        impact: 'MODIFIER',
        description:'A sequence variant located within a regulatory region'
    },
    'feature_elongation': {
        name: 'feature_elongation',
        acc:'SO:0001907',
        color: '#7F7F7F',
        impact: 'MODIFIER',
        description:'A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence'
    },
    'feature_truncation': {
        name: 'feature_truncation',
        acc:'SO:0001906',
        color: '#7F7F7F',
        impact: 'MODIFIER',
        description:'A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence'
    },
    'intergenic_variant': {
        name: 'intergenic_variant',
        acc:'SO:0001628',
        color: '#636363',
        impact: 'MODIFIER',
        description:'A sequence variant located in the intergenic region, between genes'
    }
};

consequenceTypeDetails = consequenceTypeTreeFormat(consequenceTypeDetails);
function consequenceTypeTreeFormat(data){
    _.each(_.keys(data), function (key) {
        _.extend(data[key], {leaf: true, checked: false, iconCls: 'no-icon'})
    }, data);
    return data;
};

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

var annotation_text = [
    {species: 'aaegypti_aaegl3', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl Genomes v29 geneset.', vep_version:82},
    {species: 'agambiae_agamp4', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Genomes v26 geneset.', vep_version:78},
    {species: 'aminimus_1v1', text: 'Variant Effect Predictor (VEP) v87 annotation against the VectorBase v1606 geneset.', vep_version:87},
    {species: 'aquadriannulatus_quad4av1', text: 'Variant Effect Predictor (VEP) v82 annotation against the VectorBase v1606 geneset.', vep_version:82},
    {species: 'asinensis_v1', text: 'Variant Effect Predictor (VEP) v82 annotation against the VectorBase v1606 geneset.', vep_version:82},
    {species: 'astephensi_sda500v1', text: 'Variant Effect Predictor (VEP) v82 annotation against the VectorBase v1606 geneset.', vep_version:82},
    {species: 'athaliana_tair10', text: 'Variant Effect Predictor (VEP) v87 annotation against the Ensembl Genomes v34 geneset.', vep_version:87},
    {species: 'btaurus_umd31', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.', vep_version:82},
    {species: 'chircus_10', text: '', vep_version:''},
    {species: 'csabaeus_chlsab11', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.', vep_version:82},
    {species: 'hsapiens_grch37', text: 'Variant Effect Predictor (VEP) v78 annotation against the full GENCODE Ensembl v78 geneset.', vep_version:78},
    {species: 'hsapiens_grch38', text: 'Variant Effect Predictor (VEP) v86 annotation against the full GENCODE Ensembl v86 geneset.', vep_version:86},
    {species: 'hvulgare_030312v2', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v23 geneset.', vep_version:78},
    {species: 'mmusculus_grcm38', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.', vep_version:82},
    {species: 'oaries_oarv31', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.', vep_version:82},
    {species: 'osativa_irgsp10', text: 'Variant Effect Predictor (VEP) v87 annotation against the Ensembl Genomes v30 geneset.', vep_version:87},
    {species: 'sbicolor_sorbi1', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.', vep_version:78},
    {species: 'slycopersicum_sl240', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.', vep_version:78},
    {species: 'smansoni_23792v2', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl Genomes v31 geneset.', vep_version:82},
    {species: 'sratti_ed321v504', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl Genomes v31 geneset.', vep_version:82},
    {species: 'zmays_agpv3', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.', vep_version:78},
    {species: 'ggallus_galgal4', text: 'Variant Effect Predictor (VEP) v81 annotation against the Ensembl v82 geneset.', vep_version:81}
];