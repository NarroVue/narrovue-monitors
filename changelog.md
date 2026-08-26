# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and documents major analytical and architectural milestones.

---

## [Unreleased]

### Planned

* Multi-document corpus analysis
* Temporal narrative evolution tracking
* Narrative drift detection
* Contradiction analysis across document collections
* Graph database integration (Neo4j)
* Streamlit dashboard interface
* Automated citation verification
* Public Comment Intelligence workflows
* Comparative Narrative Intelligence workflows

---

## [1.4.0] - 2026-08-26

### Fixed

* Moved `import re` to the top-level imports so the Court Rulings tracker no longer fails with `NameError`.
* Guarded the news DataFrame construction against zero-entry RSS runs, preventing a `KeyError: 'published'` when all feeds return empty.
* Fixed `NaTType does not support strftime` failures in dashboard and weekly brief exports when RSS entries contain unparseable dates.
* Narrowed the `COURT_TERMS` keyword list to prevent headlines containing "executive order" from being incorrectly classified as court rulings.
* HTML-escaped feed-sourced text rendered in dashboard tables.

### Improved

* Increased robustness of RSS ingestion and downstream reporting when feeds are empty or contain malformed dates.
* Improved classification precision for court-ruling detection.
* Improved safety of rendering externally sourced feed content in generated HTML.

---

## [0.7.0] - Research Audit Pipeline

### Added

* End-to-end narrative audit workflow.
* Claim traceability framework.
* Evidence mapping methodology.
* Dataset validation and integrity checks.
* Standardized JSON exports.
* Standardized CSV exports.
* Reproducible phase-based processing architecture.
* Structured audit-ready reporting outputs.

### Changed

* Refactored analysis workflow into discrete processing stages.
* Standardized dataset schemas across pipeline outputs.
* Improved interoperability between ingestion, extraction, classification, and export phases.

### Improved

* Reproducibility of analytical results.
* Cross-phase traceability.
* Dataset consistency validation.
* Audit readiness and reporting quality.

---

## [0.6.0] - Narrative Intelligence Framework

### Added

* Narrative signal scoring methodology.
* Lexical signal analysis.
* Semantic signal analysis.
* High-signal chunk identification.
* Section-level scoring.
* Narrative intensity metrics.
* Entity co-occurrence analysis.
* Relationship mapping workflows.

### Added (Experimental)

* Zero-shot Natural Language Inference (NLI).
* Contradiction detection.
* Entailment scoring.
* Semantic evidence matching.

### Improved

* Narrative pattern detection.
* Cross-document semantic comparison.
* Quantitative analysis of rhetorical structures.

---

## [0.5.0] - Semantic Analysis Layer

### Added

* Named Entity Recognition (NER).
* Semantic similarity analysis.
* Embedding-based text representation.
* Topic modeling workflows.
* Entity frequency analysis.
* Entity relationship extraction.

### Changed

* Expanded analytical scope from keyword-based analysis to semantic analysis.
* Introduced concept-level similarity measurements.

### Improved

* Thematic discovery across large corpora.
* Semantic clustering capabilities.
* Entity extraction accuracy.

---

## [0.4.0] - Document-Aware Ingestion

### Added

* Section-aware parsing.
* Table of contents recognition.
* Page-range targeting.
* Header suppression.
* Footer suppression.
* Structural metadata preservation.

### Changed

* Replaced basic extraction workflow with document-aware ingestion.
* Introduced structural processing prior to analysis.

### Improved

* Extraction fidelity.
* Preservation of source document structure.
* Downstream segmentation accuracy.

---

## [0.3.0] - Claim Extraction Framework

### Added

* Sentence-level claim extraction.
* Claim normalization workflow.
* Claim classification framework.
* Analytical claim taxonomy.
* Validation procedures for extracted claims.

### Added Claim Categories

* Descriptive
* Predictive
* Causal
* Policy-Predictive
* Weakly Falsifiable
* Unfalsifiable Predictive
* Normative
* Unspecified

### Improved

* Claim consistency.
* Analytical traceability.
* Structured representation of argumentative content.

---

## [0.2.0] - Structured Text Processing

### Added

* Sentence tokenization.
* Corpus cleaning workflows.
* Metadata preservation.
* Structured sentence records.
* Dataset-oriented processing architecture.

### Changed

* Transitioned from document-level processing to sentence-level processing.
* Introduced tabular analytical workflows.

### Improved

* Data organization.
* Corpus consistency.
* Support for downstream analytical operations.

---

## [0.1.0] - Initial PDF Extraction

### Added

* PDF ingestion capability.
* Multi-page document processing.
* Raw text extraction.
* Basic preprocessing workflows.
* Initial text normalization routines.

### Notes

Initial proof-of-concept focused on converting policy documents into analyzable text suitable for downstream processing.

---

## Project Scope

Current project capabilities include:

* PDF ingestion and parsing
* Structural document preservation
* Sentence extraction and normalization
* Metadata generation
* Claim extraction
* Claim classification
* Semantic similarity analysis
* Topic modeling
* Named entity recognition
* Narrative signal scoring
* Evidence mapping
* Traceability auditing
* Structured data exports
* Reproducible analytical workflows
