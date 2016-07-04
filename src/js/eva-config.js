/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014, 2015 EMBL - European Bioinformatics Institute
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

clinVarSpeciesList = [
    {
        assemblyCode: "grch37",
        taxonomyCode: "hsapiens",
        taxonomyEvaName: "Human",
        assemblyName: "GRCh37"

    }
];

var TABS = [
    "Home",
    "Submit Data",
    "Study Browser",
    "variant Browser",
    "Genome Browser",
    "About",
    "Contact"
]

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

consequenceTypesColors = [
    {id: 'transcript_ablation', color: '#FF0000', impact: 'HIGH'},
    {id: 'splice_acceptor_variant', color: '#FF581A', impact: 'HIGH'},
    {id: 'splice_donor_variant', color: '#FF581A', impact: 'HIGH'},
    {id: 'stop_gained', color: '#FF0000', impact: 'HIGH'},
    {id: 'frameshift_variant', color: '#9400D3', impact: 'HIGH'},
    {id: 'stop_lost', color: '#FF0000', impact: 'HIGH'},
    {id: 'start_lost', color: '#FFD700', impact: 'HIGH'},
//    {id:'initiator_codon_variant',color:'#FF0000'},
    {id: 'transcript_amplification', color: '#FF69B4', impact: 'HIGH'},
    {id: 'inframe_insertion', color: '#FF69B4', impact: 'MODERATE'},
    {id: 'inframe_deletion', color: '#FF69B4', impact: 'MODERATE'},
    {id: 'missense_variant', color: '#FFD700', impact: 'MODERATE'},
    {id: 'protein_altering_variant', color: '#FF0080', impact: 'MODERATE'},
    {id: 'splice_region_variant', color: '#FF7F50', impact: 'LOW'},
    {id: 'incomplete_terminal_codon_variant', color: '#FF00FF', impact: 'LOW'},
    {id: 'stop_retained_variant', color: '#76EE00', impact: 'LOW'},
    {id: 'synonymous_variant', color: '#76EE00', impact: 'LOW'},
    {id: 'coding_sequence_variant', color: '#458B00', impact: 'MODIFIER'},
    {id: 'mature_miRNA_variant', color: '#458B00', impact: 'MODIFIER'},
    {id: '5_prime_UTR_variant', color: '#7AC5CD', impact: 'MODIFIER'},
    {id: '3_prime_UTR_variant', color: '#7AC5CD', impact: 'MODIFIER'},
    {id: 'non_coding_transcript_exon_variant', color: '#32CD32', impact: 'MODIFIER'},
    {id: 'intron_variant', color: '#02599C', impact: 'MODIFIER'},
    {id: 'NMD_transcript_variant', color: '#FF4500', impact: 'MODIFIER'},
    {id: 'non_coding_transcript_variant', color: '#32CD32', impact: 'MODIFIER'},
    {id: '2KB_upstream_gene_variant', color: '#A2B5CD', impact: 'MODIFIER'},
    {id: 'upstream_gene_variant', color: '#A2B5CD', impact: 'MODIFIER'},
    {id: 'downstream_gene_variant', color: '#A2B5CD', impact: 'MODIFIER'},
    {id: 'TFBS_ablation', color: '#A52A2A', impact: 'MODERATE'},
    {id: 'TFBS_amplification', color: '#A52A2A', impact: 'MODIFIER'},
    {id: 'TF_binding_site_variant', color: '#A52A2A', impact: 'MODIFIER'},
    {id: 'regulatory_region_ablation', color: '#A52A2A', impact: 'MODERATE'},
    {id: 'regulatory_region_amplification', color: '#A52A2A', impact: 'MODIFIER'},
    {id: 'regulatory_region_variant', color: '#A52A2A', impact: 'MODIFIER'},
    {id: 'feature_elongation', color: '#7F7F7F', impact: 'MODIFIER'},
    {id: 'feature_truncation', color: '#7F7F7F', impact: 'MODIFIER'},
    {id: 'intergenic_variant', color: '#636363', impact: 'MODIFIER'}
];

consequenceTypes = [
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
                    {acc: 'SO:0001580', name: 'coding_sequence_variant', qtip: 'A sequence variant that changes the coding sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#458B00' },
                    {acc: 'SO:0001907', name: 'feature_elongation', qtip: 'A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#7F7F7F' },
                    {acc: 'SO:0001906', name: 'feature_truncation', qtip: 'A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#7F7F7F' },
                    {acc: 'SO:0001589', name: 'frameshift_variant', qtip: 'A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three', leaf: true, checked: false, iconCls: 'no-icon', color: '#9400D3' },
                    {acc: 'SO:0001626', name: 'incomplete_terminal_codon_variant', qtip: 'A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF00FF'},
                    {acc: 'SO:0001822', name: 'inframe_deletion', qtip: 'An inframe non synonymous variant that deletes bases from the coding sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF69B4'},
                    {acc: 'SO:0001821', name: 'inframe_insertion', qtip: 'An inframe non synonymous variant that inserts bases into in the coding sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF69B4'},
                    {acc: 'SO:0001583', name: 'missense_variant', qtip: 'A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved', leaf: true, checked: false, iconCls: 'no-icon', color: '#FFD700' },
                    {acc: 'SO:0001621', name: 'NMD_transcript_variant', qtip: 'A variant in a transcript that is the target of NMD', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF4500' },
                    {acc: 'SO:0001818', name: 'protein_altering_variant', qtip: 'A sequence_variant which is predicted to change the protein encoded in the coding sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF0080' },
                    {acc: 'SO:0001819', name: 'synonymous_variant', qtip: 'A sequence variant where there is no resulting change to the encoded amino acid', leaf: true, checked: false, iconCls: 'no-icon', color: '#76EE00' },
                    {acc: 'SO:0002012', name: 'start_lost', qtip: 'A codon variant that changes at least one base of the canonical start codon', leaf: true, checked: false, iconCls: 'no-icon', color: '#FFD700' },
                    {acc: 'SO:0001587', name: 'stop_gained', qtip: 'A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript', leaf: true, checked: false, iconCls: 'no-icon', color: '#ff0000' },
                    {acc: 'SO:0001578', name: 'stop_lost', qtip: 'A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript', leaf: true, checked: false, iconCls: 'no-icon', color: '#ff0000' },
                    {acc: 'SO:0001567', name: 'stop_retained_variant', qtip: 'A sequence variant where at least one base in the terminator codon is changed, but the terminator remains', leaf: true, checked: false, iconCls: 'no-icon', color: '#76EE00' }
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
                    {acc: 'SO:0001624', name: '3_prime_UTR_variant', qtip: 'A UTR variant of the 3\' UTR', leaf: true, checked: false, iconCls: 'no-icon', color: '#7AC5CD'},
                    {acc: 'SO:0001623', name: '5_prime_UTR_variant', qtip: 'A UTR variant of the 5\' UTR', leaf: true, checked: false, iconCls: 'no-icon', color: '#7AC5CD'},
                    {acc: 'SO:0001627', name: 'intron_variant', qtip: 'A transcript variant occurring within an intron', leaf: true, checked: false, iconCls: 'no-icon', color: '#02599C' },
                    {acc: 'SO:0001792', name: 'non_coding_transcript_exon_variant', qtip: 'A sequence variant that changes non-coding exon sequence', leaf: true, checked: false, iconCls: 'no-icon', color: '#32CD32' },
//                    {acc: 'SO:0001619', name: 'nc_transcript_variant', qtip: 'A transcript variant of a non coding RNA',leaf: true,checked: false,  iconCls :'no-icon' },

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
                    {acc: 'SO:0001574', name: 'splice_acceptor_variant', qtip: 'A splice variant that changes the 2 base region at the 3\' end of an intron', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF581A'},
                    {acc: 'SO:0001575', name: 'splice_donor_variant', qtip: 'A splice variant that changes the 2 base region at the 5\' end of an intron', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF581A'},
                    {acc: 'SO:0001630', name: 'splice_region_variant', qtip: 'A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF7F50' }

                ]

            },

            {acc: 'SO:0001893', name: 'transcript_ablation', qtip: 'A feature ablation whereby the deleted region includes a transcript feature', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF0000' },
            {acc: 'SO:0001889', name: 'transcript_amplification', qtip: 'A feature amplification of a region containing a transcript', leaf: true, checked: false, iconCls: 'no-icon', color: '#FF69B4' }

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
            {acc: 'SO:0001620', name: 'mature_miRNA_variant', qtip: 'A transcript variant located with the sequence of the mature miRNA', leaf: true, checked: false, iconCls: 'no-icon', color: '#458B00'},
            {acc: 'SO:0001894', name: 'regulatory_region_ablation', qtip: 'A feature ablation whereby the deleted region includes a regulatory region', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' },
            {acc: 'SO:0001891', name: 'regulatory_region_amplification', qtip: 'A feature amplification of a region containing a regulatory region', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' },
            {acc: 'SO:0001566', name: 'regulatory_region_variant', qtip: 'A sequence variant located within a regulatory region', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' },
            {acc: 'SO:0001782', name: 'TF_binding_site_variant', qtip: 'A sequence variant located within a transcription factor binding site', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' },
            {acc: 'SO:0001895', name: 'TFBS_ablation', qtip: 'A feature ablation whereby the deleted region includes a transcription factor binding site', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' },
            {acc: 'SO:0001892', name: 'TFBS_amplification', qtip: 'A feature amplification of a region containing a transcription factor binding site', leaf: true, checked: false, iconCls: 'no-icon', color: '#A52A2A' }
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
            {acc: 'SO:0001636', name: '2KB_upstream_gene_variant', qtip: 'A sequence variant located within 2KB 5\' of a gene.', leaf: true, checked: false, iconCls: 'no-icon', color: '#A2B5CD'},
            {acc: 'SO:0001632', name: 'downstream_gene_variant', qtip: 'A sequence variant located 3\' of a gene', leaf: true, checked: false, iconCls: 'no-icon', color: '#A2B5CD' },
            {acc: 'SO:0001628', name: 'intergenic_variant', qtip: 'A sequence variant located in the intergenic region, between genes', leaf: true, checked: false, iconCls: 'no-icon', color: '#636363' },
            {acc: 'SO:0001631', name: 'upstream_gene_variant', qtip: 'A sequence variant located 5\' of a gene', leaf: true, checked: false, iconCls: 'no-icon', color: '#A2B5CD'},

        ]
    }

];

variationClasses = [
    {
        name: 'Variation',
        cls: "parent",
        expanded: true,
        leaf: false,
        children: [
            {acc: "SO:0001483", name: "SNV", qtip: "SNVs are single nucleotide positions in genomic DNA at which different sequence alternatives exist.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:1000032", name: "indel", qtip: "A sequence alteration which included an insertion and a deletion, affecting 2 or more bases.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:1000002", name: "substitution", qtip: "A sequence alteration where the length of the change in the variant is the same as that of the reference.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:0000667", name: "insertion", qtip: "The sequence of one or more nucleotides added between two adjacent nucleotides in the sequence.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:0001059", name: "sequence_alteration", qtip: "A sequence_alteration is a sequence_feature whose extent is the deviation from another sequence.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:0000705", name: "tandem_repeat", qtip: "Two or more adjcent copies of a region (of length greater than 1).", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'},
            {acc: "SO:0000159", name: "deletion", qtip: "The point at which one or more contiguous nucleotides were excised.", call: "Variation", leaf: true, checked: false, iconCls: 'no-icon'}
        ]
    },
//        {
//            name:'Structural variation',
//            cls: "folder",
//            expanded: true,
//            leaf: false,
//            children: [
//                {acc: "SO:0001784", name: "complex_structural_alteration", description: "A structural sequence alteration or rearrangement encompassing one or more genome fragments.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001742", name: "copy_number_gain", description: "A sequence alteration whereby the copy number of a given regions is greater than the reference sequence.", call: "Structural variation" , leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001743", name: "copy_number_loss", description: "A sequence alteration whereby the copy number of a given region is less than the reference sequence.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001019", name: "copy_number_variation", description: "A variation that increases or decreases the copy number of a given region.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:1000035", name: "duplication", description: "One or more nucleotides are added between two adjacent nucleotides in the sequence; the inserted sequence derives from, or is identical in sequence to, nucleotides adjacent to insertion point.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001873", name: "interchromosomal_breakpoint", description: "A rearrangement breakpoint between two different chromosomes.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001874", name: "intrachromosomal_breakpoint", description: "A rearrangement breakpoint within the same chromosome.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:1000036", name: "inversion", description: "A continuous nucleotide sequence is inverted in the same position.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001837", name: "mobile_element_insertion", description: "A kind of insertion where the inserted sequence is a mobile element.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0001838", name: "novel_sequence_insertion", description: "An insertion the sequence of which cannot be mapped to the reference genome.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:1000173", name: "tandem_duplication", description: "A duplication consisting of 2 identical adjacent regions.", call: "Structural variation", leaf: true,checked: false,  iconCls :'no-icon'},
//                {acc: "SO:0000199", name: "translocation", description: "A region of nucleotide sequence that has translocated to a new position.", call: "Structural variation" , leaf: true,checked: false,  iconCls :'no-icon'}
//            ]
//        },
    {acc: "SO:0000051", name: "probe", qtip: "A DNA sequence used experimentally to detect the presence or absence of a complementary nucleic acid.", call: "CNV probe", leaf: true, checked: false, iconCls: 'no-icon'}
];

var speciesList = '';
EvaManager.get({
    category: 'meta/species',
    resource: 'list',
//    params: {loaded: true},
    async: false,
    success: function (response) {
        try {
            speciesList = response.response[0].result;
        } catch (e) {
            console.log(e);
        }
    }
});

var projects = '';
EvaManager.get({
    category: 'meta/studies',
    resource: 'all',
    async: false,
    success: function (response) {
        try {
            projects = response.response[0].result;
        } catch (e) {
            console.log(e);
        }
    }
});

var annotation_text = [
    {species: 'hvulgare_030312v2', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v23 geneset.'},
    {species: 'btaurus_umd31', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.'},
    {species: 'chircus_10', text: ''},
    {species: 'hsapiens_grch37', text: 'Variant Effect Predictor (VEP) v78 annotation against the full GENCODE Ensembl v78 geneset.'},
    {species: 'zmays_agpv3', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.'},
    {species: 'olatipes_hdrr', text: ''},
    {species: 'agambiae_agamp4', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Genomes v26 geneset.'},
    {species: 'mmusculus_grcm38', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.'},
    {species: 'oaries_oarv31', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.'},
    {species: 'sbicolor_sorbi1', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.'},
    {species: 'slycopersicum_sl240', text: 'Variant Effect Predictor (VEP) v78 annotation against the Ensembl Plants v26 geneset.'},
    {species: 'csabaeus_chlsab11', text: 'Variant Effect Predictor (VEP) v82 annotation against the Ensembl v82 geneset.'},
    {species: 'ggallus_galgal4', text: 'Variant Effect Predictor (VEP) v81 annotation against the Ensembl v82 geneset.'}
];

var AVAILABLE_SPECIES = {
    "text": "Species",
    "items": [
        {
            "text": "Vertebrates",
            "items": [
                {"text": "Homo sapiens", "assembly": "GRCh37.p10"},
                {"text": "Chlorocebus sabaeus", "assembly": "Chlorocebus_sabeus 1.1"},
                {"text": "Oryzias latipes", "assembly": "ASM31367v1"},
                {"text": "Bos taurus", "assembly": "Bos_taurus_UMD_3.1"},
                {"text": "Ovis aries", "assembly": "Oar_v3.1"},
                {"text": "Mus musculus", "assembly": "GRCm38.p3"},
                {"text": "Capra hircus", "assembly": "CHIR_1.0"},
            ]
        },
        {
            "text": "Metazoa",
            "items": [
                {"text": "Anopheles gambiae", "assembly": "AgamP3"}
            ]
        },
        {
            "text": "Plants",
            "items": [
                {"text": "Solanum lycopersicum", "assembly": "SL2.40"},
                {"text": "Zea Mays", "assembly": "AGPv3"},
                {"text": "Shorgum bicolor", "assembly": "Sorbi1"},
            ]
        }
    ]
};

DISABLE_STUDY_LINK = ['PRJX00001'];