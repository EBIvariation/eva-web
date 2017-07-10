var conseqData = [
  {
    "geneName": "BRCA2",
    "ensemblGeneId": "ENSG00000139618",
    "ensemblTranscriptId": "ENST00000544455",
    "strand": "+",
    "biotype": "protein_coding",
    "cDnaPosition": 299,
    "cdsPosition": 72,
    "aaPosition": 24,
    "aaChange": "L/F",
    "codon": "ttA/ttT",
    "proteinSubstitutionScores": [
      {
        "score": 0.961,
        "source": "Polyphen",
        "description": "probably_damaging"
      },
      {
        "score": 0,
        "source": "Sift",
        "description": "deleterious"
      }
    ],
    "soTerms": [
      {
        "soName": "missense_variant",
        "soAccession": "SO:0001583"
      }
    ]
  },
  {
    "geneName": "BRCA2",
    "ensemblGeneId": "ENSG00000139618",
    "ensemblTranscriptId": "ENST00000530893",
    "strand": "+",
    "biotype": "protein_coding",
    "cDnaPosition": 270,
    "cdsPosition": 0,
    "aaPosition": 0,
    "aaChange": "-",
    "codon": "-",
    "proteinSubstitutionScores": [],
    "soTerms": [
      {
        "soName": "5_prime_UTR_variant",
        "soAccession": "SO:0001623"
      }
    ]
  },
  {
    "geneName": "BRCA2",
    "ensemblGeneId": "ENSG00000139618",
    "ensemblTranscriptId": "ENST00000380152",
    "strand": "+",
    "biotype": "protein_coding",
    "cDnaPosition": 305,
    "cdsPosition": 72,
    "aaPosition": 24,
    "aaChange": "L/F",
    "codon": "ttA/ttT",
    "proteinSubstitutionScores": [
      {
        "score": 0.961,
        "source": "Polyphen",
        "description": "probably_damaging"
      },
      {
        "score": 0,
        "source": "Sift",
        "description": "deleterious"
      }
    ],
    "soTerms": [
      {
        "soName": "missense_variant",
        "soAccession": "SO:0001583"
      }
    ]
  },
  {
    "geneName": "ZAR1L",
    "ensemblGeneId": "ENSG00000189167",
    "ensemblTranscriptId": "ENST00000533490",
    "strand": "-",
    "biotype": "protein_coding",
    "cDnaPosition": 0,
    "cdsPosition": 0,
    "aaPosition": 0,
    "aaChange": "-",
    "codon": "-",
    "proteinSubstitutionScores": [],
    "soTerms": [
      {
        "soName": "2KB_upstream_gene_variant",
        "soAccession": "SO:0001631"
      }
    ]
  }
];

var defaultConsqTree = [
    {
        "name": "intergenic_variant",
        "acc": "SO:0001628",
        "color": "#636363",
        "impact": "MODIFIER",
        "description": "A sequence variant located in the intergenic region, between genes",
        "leaf": true,
        "checked": false,
        "iconCls": "no-icon"
    }
];

var version78ConsqTree = [
    {
        "name": "Transcript Variant",
        "children": [
            {
                "name": "Coding Variant",
                "children": [
                    {
                        "name": "coding_sequence_variant",
                        "acc": "SO:0001580",
                        "color": "#458B00",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that changes the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "feature_elongation",
                        "acc": "SO:0001907",
                        "color": "#7F7F7F",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "feature_truncation",
                        "acc": "SO:0001906",
                        "color": "#7F7F7F",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "frameshift_variant",
                        "acc": "SO:0001589",
                        "color": "#9400D3",
                        "impact": "HIGH",
                        "description": "A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "incomplete_terminal_codon_variant",
                        "acc": "SO:0001626",
                        "color": "#FF00FF",
                        "impact": "LOW",
                        "description": "A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "inframe_deletion",
                        "acc": "SO:0001822",
                        "color": "#FF69B4",
                        "impact": "MODERATE",
                        "description": "An inframe non synonymous variant that deletes bases from the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "inframe_insertion",
                        "acc": "SO:0001821",
                        "color": "#FF69B4",
                        "impact": "MODERATE",
                        "description": "An inframe non synonymous variant that inserts bases into in the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "missense_variant",
                        "acc": "SO:0001583",
                        "color": "#FFD700",
                        "impact": "MODERATE",
                        "description": "A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "NMD_transcript_variant",
                        "acc": "SO:0001621",
                        "color": "#FF4500",
                        "impact": "MODIFIER",
                        "description": "A variant in a transcript that is the target of NMD",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "synonymous_variant",
                        "acc": "SO:0001819",
                        "color": "#76EE00",
                        "impact": "LOW",
                        "description": "A sequence variant where there is no resulting change to the encoded amino acid",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_gained",
                        "acc": "SO:0001587",
                        "color": "#FF0000",
                        "impact": "HIGH",
                        "description": "A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_lost",
                        "acc": "SO:0001578",
                        "color": "#FF0000",
                        "impact": "HIGH",
                        "description": "A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "initiator_codon_variant",
                        "acc": "SO:0001582",
                        "color": "#FF0000",
                        "impact": "LOW",
                        "description": "A codon variant that changes at least one base of the first codon of a transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_retained_variant",
                        "acc": "SO:0001567",
                        "color": "#76EE00",
                        "impact": "LOW",
                        "description": "A sequence variant where at least one base in the terminator codon is changed, but the terminator remains",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "Non-coding Variant",
                "children": [
                    {
                        "name": "3_prime_UTR_variant",
                        "acc": "SO:0001624",
                        "color": "#7AC5CD",
                        "impact": "MODIFIER",
                        "description": "A UTR variant of the 3' UTR",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "5_prime_UTR_variant",
                        "acc": "SO:0001623",
                        "color": "#7AC5CD",
                        "impact": "MODIFIER",
                        "description": "A UTR variant of the 5' UTR",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "intron_variant",
                        "acc": "SO:0001627",
                        "color": "#02599C",
                        "impact": "MODIFIER",
                        "description": "A transcript variant occurring within an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "non_coding_transcript_exon_variant",
                        "acc": "SO:0001792",
                        "color": "#32CD32",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that changes non-coding exon sequence in a non-coding transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "non_coding_transcript_variant",
                        "acc": "SO:0001619",
                        "color": "#32CD32",
                        "impact": "MODIFIER",
                        "description": "A transcript variant of a non coding RNA gene",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "Splice Variant",
                "children": [
                    {
                        "name": "splice_acceptor_variant",
                        "acc": "SO:0001574",
                        "color": "#FF581A",
                        "impact": "HIGH",
                        "description": "A splice variant that changes the 2 base region at the 3' end of an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "splice_donor_variant",
                        "acc": "SO:0001575",
                        "color": "#FF581A",
                        "impact": "HIGH",
                        "description": "A splice variant that changes the 2 base region at the 5' end of an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "splice_region_variant",
                        "acc": "SO:0001630",
                        "color": "#FF7F50",
                        "impact": "LOW",
                        "description": "A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "transcript_ablation",
                "acc": "SO:0001893",
                "color": "#FF0000",
                "impact": "HIGH",
                "description": "A feature ablation whereby the deleted region includes a transcript feature",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "transcript_amplification",
                "acc": "SO:0001889",
                "color": "#FF69B4",
                "impact": "HIGH",
                "description": "A feature amplification of a region containing a transcript",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    },
    {
        "name": "Regulatory Variant ",
        "children": [
            {
                "name": "mature_miRNA_variant",
                "acc": "SO:0001620",
                "color": "#458B00",
                "impact": "MODIFIER",
                "description": "A transcript variant located with the sequence of the mature miRNA",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_ablation",
                "acc": "SO:0001894",
                "color": "#A52A2A",
                "impact": "MODERATE",
                "description": "A feature ablation whereby the deleted region includes a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_amplification",
                "acc": "SO:0001891",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A feature amplification of a region containing a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_variant",
                "acc": "SO:0001566",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A sequence variant located within a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TF_binding_site_variant",
                "acc": "SO:0001782",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A sequence variant located within a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TFBS_ablation",
                "acc": "SO:0001895",
                "color": "#A52A2A",
                "impact": "MODERATE",
                "description": "A feature ablation whereby the deleted region includes a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TFBS_amplification",
                "acc": "SO:0001892",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A feature amplification of a region containing a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    },
    {
        "name": "Intergenic Variant",
        "children": [
            {
                "name": "downstream_gene_variant",
                "acc": "SO:0001632",
                "color": "#A2B5CD",
                "impact": "MODIFIER",
                "description": "A sequence variant located 3' of a gene",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "intergenic_variant",
                "acc": "SO:0001628",
                "color": "#636363",
                "impact": "MODIFIER",
                "description": "A sequence variant located in the intergenic region, between genes",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "upstream_gene_variant",
                "acc": "SO:0001631",
                "color": "#A2B5CD",
                "impact": "MODIFIER",
                "description": "A sequence variant located 5' of a gene",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    }
];

var version82ConsqTree = [
    {
        "name": "Transcript Variant",
        "children": [
            {
                "name": "Coding Variant",
                "children": [
                    {
                        "name": "coding_sequence_variant",
                        "acc": "SO:0001580",
                        "color": "#458B00",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that changes the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "feature_elongation",
                        "acc": "SO:0001907",
                        "color": "#7F7F7F",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that causes the extension of a genomic feature, with regard to the reference sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "feature_truncation",
                        "acc": "SO:0001906",
                        "color": "#7F7F7F",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that causes the reduction of a genomic feature, with regard to the reference sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "frameshift_variant",
                        "acc": "SO:0001589",
                        "color": "#9400D3",
                        "impact": "HIGH",
                        "description": "A sequence variant which causes a disruption of the translational reading frame, because the number of nucleotides inserted or deleted is not a multiple of three",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "incomplete_terminal_codon_variant",
                        "acc": "SO:0001626",
                        "color": "#FF00FF",
                        "impact": "LOW",
                        "description": "A sequence variant where at least one base of the final codon of an incompletely annotated transcript is changed",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "inframe_deletion",
                        "acc": "SO:0001822",
                        "color": "#FF69B4",
                        "impact": "MODERATE",
                        "description": "An inframe non synonymous variant that deletes bases from the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "inframe_insertion",
                        "acc": "SO:0001821",
                        "color": "#FF69B4",
                        "impact": "MODERATE",
                        "description": "An inframe non synonymous variant that inserts bases into in the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "missense_variant",
                        "acc": "SO:0001583",
                        "color": "#FFD700",
                        "impact": "MODERATE",
                        "description": "A sequence variant, that changes one or more bases, resulting in a different amino acid sequence but where the length is preserved",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "NMD_transcript_variant",
                        "acc": "SO:0001621",
                        "color": "#FF4500",
                        "impact": "MODIFIER",
                        "description": "A variant in a transcript that is the target of NMD",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "protein_altering_variant",
                        "acc": "SO:0001818",
                        "color": "#FF0080",
                        "impact": "MODERATE",
                        "description": "A sequence_variant which is predicted to change the protein encoded in the coding sequence",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "synonymous_variant",
                        "acc": "SO:0001819",
                        "color": "#76EE00",
                        "impact": "LOW",
                        "description": "A sequence variant where there is no resulting change to the encoded amino acid",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "start_lost",
                        "acc": "SO:0002012",
                        "color": "#FFD700",
                        "impact": "HIGH",
                        "description": "A codon variant that changes at least one base of the canonical start codon",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_gained",
                        "acc": "SO:0001587",
                        "color": "#FF0000",
                        "impact": "HIGH",
                        "description": "A sequence variant whereby at least one base of a codon is changed, resulting in a premature stop codon, leading to a shortened transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_lost",
                        "acc": "SO:0001578",
                        "color": "#FF0000",
                        "impact": "HIGH",
                        "description": "A sequence variant where at least one base of the terminator codon (stop) is changed, resulting in an elongated transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "stop_retained_variant",
                        "acc": "SO:0001567",
                        "color": "#76EE00",
                        "impact": "LOW",
                        "description": "A sequence variant where at least one base in the terminator codon is changed, but the terminator remains",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "Non-coding Variant",
                "children": [
                    {
                        "name": "3_prime_UTR_variant",
                        "acc": "SO:0001624",
                        "color": "#7AC5CD",
                        "impact": "MODIFIER",
                        "description": "A UTR variant of the 3' UTR",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "5_prime_UTR_variant",
                        "acc": "SO:0001623",
                        "color": "#7AC5CD",
                        "impact": "MODIFIER",
                        "description": "A UTR variant of the 5' UTR",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "intron_variant",
                        "acc": "SO:0001627",
                        "color": "#02599C",
                        "impact": "MODIFIER",
                        "description": "A transcript variant occurring within an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "non_coding_transcript_exon_variant",
                        "acc": "SO:0001792",
                        "color": "#32CD32",
                        "impact": "MODIFIER",
                        "description": "A sequence variant that changes non-coding exon sequence in a non-coding transcript",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "non_coding_transcript_variant",
                        "acc": "SO:0001619",
                        "color": "#32CD32",
                        "impact": "MODIFIER",
                        "description": "A transcript variant of a non coding RNA gene",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "Splice Variant",
                "children": [
                    {
                        "name": "splice_acceptor_variant",
                        "acc": "SO:0001574",
                        "color": "#FF581A",
                        "impact": "HIGH",
                        "description": "A splice variant that changes the 2 base region at the 3' end of an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "splice_donor_variant",
                        "acc": "SO:0001575",
                        "color": "#FF581A",
                        "impact": "HIGH",
                        "description": "A splice variant that changes the 2 base region at the 5' end of an intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    },
                    {
                        "name": "splice_region_variant",
                        "acc": "SO:0001630",
                        "color": "#FF7F50",
                        "impact": "LOW",
                        "description": "A sequence variant in which a change has occurred within the region of the splice site, either within 1-3 bases of the exon or 3-8 bases of the intron",
                        "leaf": true,
                        "checked": false,
                        "iconCls": "no-icon"
                    }
                ],
                "cls": "parent",
                "expanded": true,
                "leaf": false,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "transcript_ablation",
                "acc": "SO:0001893",
                "color": "#FF0000",
                "impact": "HIGH",
                "description": "A feature ablation whereby the deleted region includes a transcript feature",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "transcript_amplification",
                "acc": "SO:0001889",
                "color": "#FF69B4",
                "impact": "HIGH",
                "description": "A feature amplification of a region containing a transcript",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    },
    {
        "name": "Regulatory Variant ",
        "children": [
            {
                "name": "mature_miRNA_variant",
                "acc": "SO:0001620",
                "color": "#458B00",
                "impact": "MODIFIER",
                "description": "A transcript variant located with the sequence of the mature miRNA",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_ablation",
                "acc": "SO:0001894",
                "color": "#A52A2A",
                "impact": "MODERATE",
                "description": "A feature ablation whereby the deleted region includes a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_amplification",
                "acc": "SO:0001891",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A feature amplification of a region containing a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "regulatory_region_variant",
                "acc": "SO:0001566",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A sequence variant located within a regulatory region",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TF_binding_site_variant",
                "acc": "SO:0001782",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A sequence variant located within a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TFBS_ablation",
                "acc": "SO:0001895",
                "color": "#A52A2A",
                "impact": "MODERATE",
                "description": "A feature ablation whereby the deleted region includes a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "TFBS_amplification",
                "acc": "SO:0001892",
                "color": "#A52A2A",
                "impact": "MODIFIER",
                "description": "A feature amplification of a region containing a transcription factor binding site",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    },
    {
        "name": "Intergenic Variant",
        "children": [
            {
                "name": "downstream_gene_variant",
                "acc": "SO:0001632",
                "color": "#A2B5CD",
                "impact": "MODIFIER",
                "description": "A sequence variant located 3' of a gene",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "intergenic_variant",
                "acc": "SO:0001628",
                "color": "#636363",
                "impact": "MODIFIER",
                "description": "A sequence variant located in the intergenic region, between genes",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            },
            {
                "name": "upstream_gene_variant",
                "acc": "SO:0001631",
                "color": "#A2B5CD",
                "impact": "MODIFIER",
                "description": "A sequence variant located 5' of a gene",
                "leaf": true,
                "checked": false,
                "iconCls": "no-icon"
            }
        ],
        "cls": "parent",
        "expanded": true,
        "leaf": false,
        "checked": false,
        "iconCls": "no-icon"
    }
]