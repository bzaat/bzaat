// All numbers here come from the project repositories (results files, REPORT.md, paper sources).
// See ../portfolio-content.md for the verification notes behind each figure.

export const profile = {
  name: "Pham Nguyen Khanh Nguyen",
  github: "https://github.com/bzaat",
  githubHandle: "bzaat",
  email: "nguyentvvn12@gmail.com",
  linkedin: "https://www.linkedin.com/in/khanh-nguyen-pham-nguyen-7b822b371",
  cv: "Pham_Nguyen_Khanh_Nguyen_CV.pdf",
  education: "B.Sc. Artificial Intelligence, FPT University, Ho Chi Minh City",
  graduation: "Expected May 2028",
  availability: "Open to AI / Deep Learning internships, Feb–Apr 2027",
  availabilityDetail: "11-week full-time internship (OJT) in Malaysia",
  photo: "photo.jpg",
  location: "Ho Chi Minh City, Vietnam",
  roles: "AI/ML Engineer, Deep Learning Engineer, Computer Vision Engineer, Data Scientist",
  spoken: "Vietnamese (native), English (professional working proficiency)",
};

/* ------------------------------------------------------------------ */
// Hero chart: mean validation accuracy (%) per epoch over seeds 42/43/44,
// from pytorch-resnet50v1-implementation/results/<exp>/seed<k>/metrics.csv
export const valCurves = {
  scratch: [
    3.17, 3.62, 4.76, 5.07, 5.89, 6.52, 8.38, 9.6, 10.37, 12.23, 10.91, 13.5, 13.63, 13.81, 16.12, 16.8, 17.07,
    18.43, 19.52, 19.93, 20.61, 22.06, 21.69, 23.05, 25.0, 24.59, 26.4, 27.45, 26.95, 27.99, 28.58, 28.08, 30.66,
    30.34, 31.02, 31.7, 32.7, 33.83, 35.01, 34.42, 36.41, 36.55, 36.14, 36.37, 37.41, 37.82, 37.27, 38.41, 38.18,
    37.91,
  ],
  transfer: [73.73, 80.25, 85.73, 86.55, 89.9, 93.39, 93.39, 94.57, 94.79, 94.75],
  scratchTest: "32.0 ± 1.1%",
  transferTest: "92.4 ± 0.3%",
};

/* ------------------------------------------------------------------ */
export type Publication = {
  id: string;
  title: string;
  authors: { name: string; me?: boolean }[];
  venue: string;
  venueDetail: string;
  role: string;
  status: string;
  abstract: string;
  abstractNote?: string;
  keyResult: string;
  presented?: string;
  limitation?: string;
  certificate?: { img: string; pdf: string; alt: string };
  links: { label: string; href: string }[];
  bibtex: string;
};

export const publications: Publication[] = [
  {
    id: "sci2026",
    title: "The Impact of Suburb-Level Encoding on Melbourne Housing Price Prediction",
    authors: [
      { name: "Nguyen Pham", me: true },
      { name: "Thu Le" },
      { name: "Vu Tran" },
      { name: "Vy Truong" },
      { name: "Thuan Vu" },
    ],
    venue: "SCI-2026",
    venueDetail:
      "8th International Conference on Smart Computing and Informatics. To appear in Smart Computing Paradigms: Human-Centric Systems for Sustainable Development, Vol. 4 (Springer).",
    role: "First author (1 of 5)",
    status: "Accepted",
    presented: "Presented 28–29 April 2026, Swinburne Vietnam, Hanoi.",
    certificate: {
      img: "SCI-2026_Certificate.jpg",
      pdf: "SCI-2026_Certificate_of_Appreciation.pdf",
      alt: "SCI-2026 certificate of appreciation for presenting the paper",
    },
    keyResult: "Suburb encoding lifts Random Forest test R² from 0.815 to 0.835; a shuffled-suburb control removes the gain.",
    abstract:
      "This paper examines whether suburb-level encoding improves housing price prediction on a Melbourne housing dataset. The workflow covers data cleaning, missing-value handling, categorical encoding, outlier treatment, exploratory analysis, and regression modeling. We evaluate Linear Regression, Ridge Regression, Lasso Regression, Random Forest, Extra Trees, XGBoost, and LightGBM using 5-fold cross-validation with log-transformed house prices as the target. Among the evaluated models, XGBoost and LightGBM achieved the best predictive performance, both reaching an R² of 0.843 on the log-price scale. To further examine the role of locality, we conducted a locality ablation and leakage-control study using suburb encoding. Adding suburb information improved hold-out performance, while a shuffled-suburb control degraded results, indicating that the gain comes from meaningful locality signal rather than spurious encoding effects. SHAP analysis further showed that Suburb, Distance, Landsize, and Rooms were the most influential features. These results show that both model choice and fine-grained locality encoding are important for housing price prediction.",
    links: [
      {
        label: "Accepted manuscript (PDF)",
        href: "https://github.com/bzaat/Real-Estate-Price-Analysis/blob/main/Realestate%20(3).pdf",
      },
      { label: "Code", href: "https://github.com/bzaat/Real-Estate-Price-Analysis" },
    ],
    bibtex: `@inproceedings{pham2026suburb,
  title     = {The Impact of Suburb-Level Encoding on Melbourne Housing Price Prediction},
  author    = {Pham, Nguyen and Le, Thu and Tran, Vu and Truong, Vy and Vu, Thuan},
  booktitle = {Smart Computing Paradigms: Human-Centric Systems for Sustainable Development, Volume 4
               (8th International Conference on Smart Computing and Informatics, SCI-2026)},
  publisher = {Springer},
  year      = {2026},
  note      = {Accepted, to appear}
}`,
  },
  {
    id: "iecon2026",
    title: "Uncertainty-Triggered Active Sensing for UAV Maritime Rescue Prioritization under Wave Occlusion",
    authors: [
      { name: "Nguyen Trinh Quy" },
      { name: "Tran Thanh Vu" },
      { name: "Pham Nguyen Khanh Nguyen", me: true },
      { name: "Thu Le" },
    ],
    venue: "IECON 2026",
    venueDetail: "Annual Conference of the IEEE Industrial Electronics Society.",
    role: "Third author (3 of 4)",
    status: "Accepted",
    keyResult:
      "Worst-case victim survival 0.25 vs 0.16 for nearest-first routing; false-alarm visits cut from 60.5% to 35.0% (simulation).",
    limitation: "Results against deterministic expected-risk routing are mixed, because verification descents add latency.",
    abstractNote: "Abstract from the project’s manuscript source; wording may differ slightly from the camera-ready version.",
    abstract:
      "Unmanned aerial vehicles are increasingly used in maritime search and rescue because they can cover large sea areas without placing flight crews at risk. Current vision-based systems, however, often treat detections and class probabilities as deterministic observations. This assumption is fragile when waves, spray, glare, and altitude changes obscure a victim: a drowning victim can be assigned a low or ambiguous posture score while the rescue scheduler moves to easier targets. The framework represents posture uncertainty with evidential deep learning, propagates spatial and epistemic uncertainty into a drift-aware Kalman tracker, and triggers a lower-altitude verification pass when an observation is both risky and uncertain. Confirmed tracks are then ranked by a risk-averse priority score that combines posture risk, uncertainty, estimated travel time, and survival decay. Since public maritime UAV datasets do not provide frame-level distress labels, the closed loop is evaluated in simulation using a distance- and occlusion-dependent evidential proxy. Across 500 Monte Carlo trials with three-victim scenarios, visual distractors, and 30% initial occlusion, the framework achieves a worst-case victim survival rate of 0.25 ± 0.19 and a catastrophic failure rate of 67%, improving on the distance-based routing baseline (0.16 ± 0.17 and 83%).",
    links: [
      { label: "Paper", href: "https://drive.google.com/file/d/1FCH_cXJ0TVkZ_ojBMmjDJuSu9dBFo4y0/view?usp=sharing" },
      { label: "Code", href: "https://github.com/nguyentrinhquy1411/DAP391m-SU26" },
      { label: "Live demo", href: "https://nguyentrinhquy1411-dap391m-su26-app-f0wroj.streamlit.app/" },
    ],
    bibtex: `@inproceedings{quy2026uncertainty,
  title     = {Uncertainty-Triggered Active Sensing for UAV Maritime Rescue Prioritization under Wave Occlusion},
  author    = {Nguyen, Trinh Quy and Tran, Thanh Vu and Pham, Nguyen Khanh Nguyen and Le, Thu},
  booktitle = {IECON 2026 -- Annual Conference of the IEEE Industrial Electronics Society},
  year      = {2026},
  note      = {Accepted, to appear}
}`,
  },
];

/* ------------------------------------------------------------------ */
export type Category = "Computer Vision" | "Decision-Making AI" | "Applied ML";
export const categories: Category[] = ["Computer Vision", "Decision-Making AI", "Applied ML"];

export type Table = {
  caption: string;
  columns: { label: string; numeric?: boolean }[];
  rows: { cells: string[]; best?: boolean }[];
  note?: string;
};

export type Project = {
  id: string;
  title: string;
  category: Category;
  status?: string;
  summary: string;
  headline: { value: string; label: string };
  tags: string[];
  problem: string[];
  diagram: string;
  diagramAlt: string;
  decisions: { title: string; body: string }[];
  tables: Table[];
  figures?: { src: string; alt: string; caption: string; w: number; h: number }[];
  limitations: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "resnet50",
    title: "ResNet-50 from scratch vs. transfer learning",
    category: "Computer Vision",
    summary:
      "ResNet-50 written by hand in PyTorch and compared against an ImageNet-pretrained backbone on 37 pet breeds, with a leakage-free protocol and three seeds.",
    headline: { value: "92.4% vs 32.0%", label: "test accuracy, pretrained vs. from scratch" },
    tags: ["PyTorch", "ResNet-50", "Transfer learning", "Oxford-IIIT Pet", "Docker"],
    problem: [
      "Fine-grained classification of 37 cat and dog breeds from about 100 training images per class (2,944 train, 736 validation).",
      "A single RTX 3050 6 GB laptop GPU.",
      "An earlier version picked checkpoints on the test set. The protocol was rebuilt to remove that leak, and the old numbers are kept and marked as superseded.",
      "A real crash at epoch 37 exposed a resume bug that replayed epoch 1’s data order. It was fixed by checkpointing RNG state.",
    ],
    diagram: `flowchart TD
    ANN["Official annotations<br/>trainval.txt / test.txt"] --> SPLIT["Stratified 80/20 split<br/>committed JSON, split seed 0"]
    SPLIT --> DS["OxfordData Dataset<br/>train / val / test"]
    DS --> AUG["RandomResizedCrop + flip<br/>ImageNet normalization"]
    AUG --> A["From scratch<br/>3-4-6-3 bottlenecks"]
    AUG --> B["ImageNet ResNet-50<br/>frozen to layer3, BN in eval"]
    A --> LOOP["SGD + cosine LR"]
    B --> LOOP
    LOOP -->|each epoch| VAL["Validation"]
    VAL --> CK["Checkpoints<br/>model, optimizer, scheduler, RNG"]
    CK -->|resume| LOOP
    CK -->|once, after training| TEST["Test split<br/>summary.json"]
    TEST --> AGG["Mean ± std<br/>seeds 42 / 43 / 44"]`,
    diagramAlt:
      "Data flows from the official annotations through a fixed stratified split and augmentation into either the from-scratch ResNet-50 or the frozen ImageNet backbone. Both share an SGD and cosine training loop with per-epoch validation, resumable checkpoints, a single final test evaluation, and multi-seed aggregation.",
    decisions: [
      {
        title: "Architecture from first principles",
        body: "Stem, then 3-4-6-3 bottleneck stages (1×1, 3×3, 1×1) with 1×1 projection shortcuts when shape changes. Kaiming init for convs, no dependency on torchvision.models.",
      },
      {
        title: "Freezing BatchNorm correctly",
        body: "requires_grad=False does not stop BatchNorm running statistics from updating. MyModel.train() keeps the pretrained backbone in eval mode so ImageNet statistics stay intact; only layer4 and the new head train (17.1M of 25.6M parameters).",
      },
      {
        title: "Resumable checkpoints with full state",
        body: "Each checkpoint stores model, optimizer, scheduler, epoch, best validation score, class names and RNG state, so a resumed run continues with fresh shuffles instead of replaying epoch 1.",
      },
      {
        title: "Test set used once",
        body: "Checkpoints are chosen on a committed, stratified validation split. The official test split is evaluated once per checkpoint, after training.",
      },
    ],
    tables: [
      {
        caption: "Official test split (3,669 images), mean ± std over 3 seeds, checkpoint chosen on validation",
        columns: [
          { label: "Experiment" },
          { label: "Test acc", numeric: true },
          { label: "Val acc (best)", numeric: true },
          { label: "Train acc (last)", numeric: true },
          { label: "Train time", numeric: true },
        ],
        rows: [
          { cells: ["From scratch, 37 breeds, 50 epochs", "31.99 ± 1.13%", "38.45 ± 0.47%", "73.12 ± 1.66%", "29.7 min"] },
          {
            cells: ["ImageNet V2, 37 breeds, 10 epochs", "92.39 ± 0.27%", "94.93 ± 0.51%", "99.47 ± 0.12%", "3.1 min"],
            best: true,
          },
          { cells: ["ImageNet V2, cat vs dog, 10 epochs", "99.65 ± 0.07%", "99.91 ± 0.08%", "99.95 ± 0.04%", "2.9 min"] },
        ],
        note: "Pretraining adds 60.4 points of test accuracy with about 9.5× less training time. The from-scratch model overfits: 73% train accuracy against 32% on test.",
      },
    ],
    figures: [
      {
        src: "img/resnet_val_accuracy.png",
        alt: "Validation accuracy of ResNet-50 from scratch vs pretrained, mean over 3 seeds",
        caption: "Validation accuracy, mean ± std over 3 seeds.",
        w: 770,
        h: 440,
      },
      {
        src: "img/resnet_confusion_pretrained.png",
        alt: "Normalised confusion matrix of the pretrained model on the test split",
        caption: "Pretrained model, test confusion matrix (seed 42). Most errors are between similar breeds.",
        w: 900,
        h: 900,
      },
    ],
    limitations:
      "The two models differ in more than pretraining (epochs, trainable parameters, BatchNorm mode, head size). Three seeds, no hyperparameter search, cuDNN not forced deterministic.",
    links: [{ label: "Repository", href: "https://github.com/bzaat/pytorch-resnet50v1-implementation" }],
  },
  {
    id: "badminton",
    title: "Badminton singles analytics from broadcast video",
    category: "Computer Vision",
    status: "In progress",
    summary:
      "Hit detection, shot-type classification and court-space movement features for 12 professional singles matches, evaluated leave-one-match-out. A Faster R-CNN detector is the next stage.",
    headline: { value: "0.707", label: "macro F1, 12 shot types (majority baseline 0.034)" },
    tags: ["OpenCV", "Homography", "COCO-17 pose", "scikit-learn", "Faster R-CNN", "pytest"],
    problem: [
      "12 matches, 9 players and 4 tournaments. One player appears in 7 matches, so frame-level random splits would leak.",
      "Annotations are noisy and misaligned: TrackNet shuttle predictions, player boxes one frame off, 13% of rallies not starting with a serve.",
      "The shuttle is about 10×10 px in a 1280×720 frame.",
      "Strong class imbalance: 2,875 net shots against 85 flick serves.",
    ],
    diagram: `flowchart TD
    RAW["BFMD annotations<br/>shuttle, COCO-17 pose, boxes, court"] --> ALIGN["Measured frame alignment<br/>checked against video"]
    ALIGN --> COURT["Court model + homography<br/>pixels to court metres"]
    COURT --> MD["MatchData<br/>329,819 frames, 1,058 rallies, 11,301 hits"]
    MD --> HIT["Hit detection<br/>shuttle acceleration + wrist cues"]
    MD --> MOVE["Movement features<br/>distance, speed, zones, recovery"]
    HIT --> SHOT["Shot-type classifier<br/>37 features, gradient boosting"]
    DET["In progress: Faster R-CNN<br/>players + shuttle, 16 px anchors"] -.-> MD`,
    diagramAlt:
      "BFMD annotations are aligned frame by frame and mapped onto the court with a homography, producing a validated MatchData table. Hit detection and movement features read from it, and detected hits feed a shot-type classifier. An in-progress Faster R-CNN detector will later replace the annotation inputs.",
    decisions: [
      {
        title: "Alignment decided by measurement",
        body: "Player boxes shift +1 frame because pose and manual boxes reach IoU 0.97 to 1.00 at that shift (0.88 to 0.91 without). Checked against decoded video for one match.",
      },
      {
        title: "An independent sanity check",
        body: "The service-court rule holds for 98.6% of serves (555 of 563), which confirms the court mapping, top/bottom assignment and serve labels at once.",
      },
      {
        title: "Leave-one-match-out everywhere",
        body: "Thresholds and weights are chosen on 11 matches and tested on the held-out one. Design exploration used 3 matches; the 9 never-inspected matches scored higher.",
      },
      {
        title: "A second tracker on raw video",
        body: "TrackNetV3 run on a 50 s clip agrees with the dataset's shuttle track to a median of 2.2 px; a one-frame shift gives 10.5 / 11.1 px, so the alignment is exact. The same check showed the dataset README's shuttle-centre definition was off by 5.12 px, which was fixed in the analysis and in the detector's labels.",
      },
      {
        title: "Small-object detector design",
        body: "Native 720p input, smallest anchor 16 px instead of 32, flips and colour jitter only, because random crops cut the shuttle out.",
      },
    ],
    tables: [
      {
        caption: "Hit detection, held-out matches pooled, tolerance ±2 frames",
        columns: [
          { label: "Variant" },
          { label: "Precision", numeric: true },
          { label: "Recall", numeric: true },
          { label: "F1", numeric: true },
        ],
        rows: [
          { cells: ["Pose only (reference)", "0.232", "0.376", "0.287"] },
          { cells: ["Shuttle only", "0.701", "0.679", "0.690"] },
          { cells: ["Shuttle + wrist rules", "0.757", "0.683", "0.718"] },
          { cells: ["Logistic regression", "0.757", "0.716", "0.736"], best: true },
        ],
        note: "Serves are the main failure (recall 0.133) because the shuttle starts from rest. Recall excluding serves is 0.768.",
      },
      {
        caption: "Shot-type classification, 12 classes, held-out matches pooled",
        columns: [
          { label: "Model" },
          { label: "Accuracy", numeric: true },
          { label: "Macro F1 [95% CI]", numeric: true },
        ],
        rows: [
          { cells: ["Majority class", "0.254", "0.034"] },
          { cells: ["Logistic regression", "0.736", "0.646 [0.601, 0.676]"] },
          { cells: ["Gradient-boosted trees", "0.793", "0.707 [0.661, 0.737]"], best: true },
        ],
        note: "Confidence intervals from a match-level bootstrap. End to end, 48.4% of annotated hits are both detected and correctly classified.",
      },
    ],
    limitations:
      "12 matches, 9 players, one broadcast style. Every signal comes from annotations, so their errors cap performance. The detector has no results yet.",
    links: [
      { label: "Repository", href: "https://github.com/bzaat/Badminton_Project" },
      { label: "Project showcase", href: "https://bzaat.github.io/Badminton_Project/" },
    ],
  },
  {
    id: "uav-sar",
    title: "Active evidential sensing for UAV maritime rescue",
    category: "Decision-Making AI",
    summary:
      "A closed-loop UAV decision framework where evidential uncertainty drives Kalman tracking, a verification descent, and risk-averse rescue ordering. Published at IECON 2026 (third author).",
    headline: { value: "0.25 vs 0.16", label: "worst-case victim survival vs. nearest-first routing" },
    tags: ["Evidential deep learning", "Kalman filter", "Active sensing", "PyTorch", "Streamlit"],
    problem: [
      "Nearest-first routing ignores urgency; plain expected-risk routing trusts unreliable estimates when waves hide a victim.",
      "Public maritime UAV datasets have no drowning or floating labels, so the loop is evaluated with a simulated evidential classifier. Results support the decision mechanism, not a deployed detector.",
      "The UAV carries a finite number of rescue packages, and visiting a buoy or debris wastes one.",
      "Uncertainty must come from a single forward pass to stay real-time on a flight computer.",
    ],
    diagram: `flowchart TD
    IN["RGB + thermal<br/>+ UAV telemetry"] --> FEAT["Detections<br/>7-D geometric features"]
    FEAT --> EDL["Evidential classifier<br/>Dirichlet evidence, uncertainty u"]
    EDL --> KF["Kalman tracker<br/>noise grows with u"]
    EDL --> TRIG{"Uncertain and<br/>high risk?"}
    TRIG -- yes --> DESC["Verification descent<br/>40 m to 20 m"]
    DESC --> KF
    TRIG -- no --> PRI
    KF --> PRI["Risk-averse priority<br/>risk, uncertainty, decay, distance"]
    PRI --> ROUTE["Rescue routing<br/>finite payload"]`,
    diagramAlt:
      "Sensor input becomes detections and geometric features, which an evidential classifier turns into posture beliefs and an uncertainty value. Uncertainty widens the Kalman tracker’s measurement noise and, when a target is both uncertain and high-risk, triggers a lower-altitude verification descent. Confirmed tracks are ranked by a risk-averse priority score that drives rescue routing.",
    decisions: [
      {
        title: "Evidential learning instead of sampling",
        body: "Dirichlet evidence in one forward pass: 0.049 ms for the EDL MLP against 4.49 ms for 50-pass MC Dropout and 5× the memory for a 5-model ensemble.",
      },
      {
        title: "Uncertainty-scaled measurement noise",
        body: "R = Σgeo + γ·u·I, so under wave occlusion the tracker trusts its drift model over noisy projected detections.",
      },
      {
        title: "Verification only when it matters",
        body: "Descent triggers only when uncertainty and expected risk are both high, and its latency counts against time-to-rescue, so verifying everything is penalized.",
      },
      {
        title: "Statistics, not single runs",
        body: "Four baselines and ablations, paired Wilcoxon tests with Cohen’s d, plus robustness and sensitivity sweeps.",
      },
    ],
    tables: [
      {
        caption: "Monte Carlo simulation: 3 victims, 2 distractors, 30% initial occlusion, payload of 3",
        columns: [
          { label: "Method" },
          { label: "Worst VSR ↑", numeric: true },
          { label: "CFR ↓", numeric: true },
          { label: "RPE ↑", numeric: true },
          { label: "False alarms ↓", numeric: true },
        ],
        rows: [
          { cells: ["AES-RARR (full)", "0.25 ± 0.19", "0.67", "0.77 ± 0.21", "35.0%"], best: true },
          { cells: ["No active branch", "0.24 ± 0.14", "0.72", "0.65 ± 0.19", "53.0%"] },
          { cells: ["Static measurement cov.", "0.30 ± 0.15", "0.60", "0.82 ± 0.18", "n/a"] },
          { cells: ["Deterministic expected risk", "0.26 ± 0.14", "0.70", "0.65 ± 0.19", "52.0%"] },
          { cells: ["Distance router", "0.16 ± 0.17", "0.83", "0.60 ± 0.20", "60.5%"] },
        ],
        note: "VSR: victim survival rate. CFR: share of trials where worst-case survival falls below 0.35. RPE: share of packages delivered to real victims. Against the distance router: Wilcoxon p < 0.001, Cohen’s d = 0.523. The static-covariance ablation scores higher than the full system on worst-case survival; the paper reports this openly.",
      },
    ],
    limitations:
      "Simulation with a proxy classifier; no trained image-based distress model yet. Simplified survival and flight models.",
    links: [
      { label: "Repository", href: "https://github.com/nguyentrinhquy1411/DAP391m-SU26" },
      { label: "Live ground-station demo", href: "https://nguyentrinhquy1411-dap391m-su26-app-f0wroj.streamlit.app/" },
    ],
  },
  {
    id: "housing",
    title: "Suburb-level encoding for housing price prediction",
    category: "Applied ML",
    summary:
      "Seven regression models, leakage-safe target encoding and a shuffled-suburb negative control on Melbourne housing data. The code behind the SCI-2026 paper.",
    headline: { value: "0.843", label: "5-fold CV R², XGBoost and LightGBM" },
    tags: ["scikit-learn", "XGBoost", "LightGBM", "SHAP", "SQL"],
    problem: [
      "Suburb is a high-cardinality categorical feature; naive encodings overfit or leak the target.",
      "The design has to separate ‘suburb carries signal’ from ‘any extra feature helps’.",
      "Melbourne Housing Snapshot, cleaned from 13,580 to 10,480 rows.",
    ],
    diagram: `flowchart TD
    RAW["Raw data<br/>13,580 rows"] --> CLEAN["Cleaning + outliers<br/>10,480 rows"]
    CLEAN --> SPLIT["80/20 split<br/>target log(Price)"]
    SPLIT --> CV["5-fold CV"]
    CV --> TE["Suburb target encoding<br/>fit inside each fold"]
    TE --> MODELS["7 regression models"]
    MODELS --> ABL["Ablation<br/>none / suburb / shuffled"]
    MODELS --> SHAP["SHAP attribution"]`,
    diagramAlt:
      "Raw data is cleaned, split 80/20 with log price as the target, and evaluated with 5-fold cross-validation where suburb target encoding is fitted inside each fold. Seven models are compared, followed by a suburb ablation with a shuffled control and SHAP attribution.",
    decisions: [
      {
        title: "Encoding fitted inside each fold",
        body: "Target encoding (smoothing 10, min_samples_leaf 20) is refitted per fold so a suburb’s price statistics never leak into its own validation rows.",
      },
      {
        title: "A negative control",
        body: "Shuffling suburb labels keeps the feature’s cardinality but destroys its meaning. If the gain had survived the shuffle, it would not have come from location.",
      },
      {
        title: "Explain, not just score",
        body: "SHAP on the best model ranks Suburb, Distance, Landsize and Rooms as the most influential features.",
      },
    ],
    tables: [
      {
        caption: "Random Forest locality ablation (paper values, log-price scale)",
        columns: [{ label: "Setting" }, { label: "Train R²", numeric: true }, { label: "Test R²", numeric: true }],
        rows: [
          { cells: ["Without suburb", "0.847", "0.815"] },
          { cells: ["With suburb", "0.871", "0.835"], best: true },
          { cells: ["Shuffled suburb (control)", "0.851", "0.810"] },
        ],
      },
      {
        caption: "Model comparison, 5-fold CV R² (paper values)",
        columns: [{ label: "Model" }, { label: "CV R²", numeric: true }],
        rows: [
          { cells: ["Lasso", "0.729"] },
          { cells: ["Linear / Ridge", "0.736"] },
          { cells: ["Extra Trees", "0.808"] },
          { cells: ["Random Forest", "0.819"] },
          { cells: ["XGBoost / LightGBM", "0.843"], best: true },
        ],
        note: "Re-running the repository code gives values within about 0.006 R² of the paper; conclusions are unchanged.",
      },
    ],
    figures: [
      {
        src: "img/melb_model_comparison.png",
        alt: "5-fold CV R² of seven regression models",
        caption: "5-fold CV R² of the 7 models (re-computed from the repo code).",
        w: 1400,
        h: 689,
      },
      {
        src: "img/melb_suburb_ablation.png",
        alt: "Random Forest suburb ablation and shuffled-suburb control",
        caption: "Random Forest without / with / shuffled suburb (re-computed; the paper reports 0.815 / 0.835 / 0.810 test R²).",
        w: 1400,
        h: 536,
      },
    ],
    limitations: "One tabular dataset from one city.",
    links: [{ label: "Repository", href: "https://github.com/bzaat/Real-Estate-Price-Analysis" }],
  },
];

/* ------------------------------------------------------------------ */
export const stack: { group: string; items: string[] }[] = [
  { group: "Deep learning", items: ["PyTorch", "torchvision", "TensorBoard", "Evidential deep learning"] },
  { group: "Computer vision", items: ["OpenCV", "ResNet", "Faster R-CNN", "MobileNetV3", "Pose (COCO-17)", "Homography"] },
  { group: "Classical ML", items: ["scikit-learn", "XGBoost", "LightGBM", "SHAP"] },
  { group: "Engineering", items: ["Python", "SQL", "C (basic)", "Docker", "Linux", "Bash", "Git", "uv", "pytest"] },
  { group: "Communication", items: ["LaTeX", "Streamlit", "Jupyter"] },
];

export const roadmap: { phase: string; when: string; items: string[] }[] = [
  {
    phase: "Now",
    when: "2026",
    items: [
      "Sports video analytics: badminton detection and shot understanding",
      "Uncertainty-aware perception for decision making",
    ],
  },
  {
    phase: "Next",
    when: "2027",
    items: [
      "Vision Transformers",
      "Deployment path: C++, ONNX export, TensorRT (learning; not yet used in a project)",
      "2D-to-3D reconstruction",
    ],
  },
  {
    phase: "Long term",
    when: "Research direction",
    items: ["Embodied AI", "Vision-Language-Action (VLA) models", "World models"],
  },
];
