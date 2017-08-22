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

var annotation_text = [
    {species: 'aaegypti_aaegl3', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'agambiae_agamp4', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'aminimus_1v1', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the VectorBase v{cacheVersion} geneset.'},
    {species: 'aquadriannulatus_quad4av1', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the VectorBase v{cacheVersion} geneset.'},
    {species: 'asinensis_v1', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the VectorBase v{cacheVersion} geneset.'},
    {species: 'astephensi_sda500v1', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the VectorBase v{cacheVersion} geneset.'},
    {species: 'athaliana_tair10', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'btaurus_umd31', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl v{cacheVersion} geneset.'},
    {species: 'chircus_10', text: ''},
    {species: 'csabaeus_chlsab11', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl v{cacheVersion} geneset.'},
    {species: 'hsapiens_grch37', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the full GENCODE Ensembl v{cacheVersion} geneset.'},
    {species: 'hsapiens_grch38', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the full GENCODE Ensembl v{cacheVersion} geneset.'},
    {species: 'hvulgare_030312v2', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Plants v{cacheVersion} geneset.'},
    {species: 'mmusculus_grcm38', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl v{cacheVersion} geneset.'},
    {species: 'oaries_oarv31', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl v{cacheVersion} geneset.'},
    {species: 'osativa_irgsp10', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'sbicolor_sorbi1', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Plants v{cacheVersion} geneset.'},
    {species: 'slycopersicum_sl240', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Plants v{cacheVersion} geneset.'},
    {species: 'smansoni_23792v2', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'sratti_ed321v504', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Genomes v{cacheVersion} geneset.'},
    {species: 'zmays_agpv3', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl Plants v{cacheVersion} geneset.'},
    {species: 'ggallus_galgal4', text: 'Variant Effect Predictor (VEP) v{vepVersion} annotation against the Ensembl v{cacheVersion} geneset.'}
];

