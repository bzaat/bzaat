<h1 align="center">Pham Nguyen Khanh Nguyen</h1>
<p align="center">
  <b>AI undergraduate · Machine Learning · Deep Learning · Computer Vision</b><br>
  FPT University, Ho Chi Minh City, Vietnam (B.AI, expected 05/2028)
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/khanh-nguyen-pham-nguyen-7b822b371"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white"></a>
  <a href="mailto:nguyentvvn12@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white"></a>
</p>

## About me

I am an AI undergraduate looking for an **11-week full-time OJT internship (Feb–Apr 2027) with TAR UMT partner companies in Malaysia**. I enjoy building models from scratch to understand how they work, and I want to learn in an international team environment.

- **Target roles:** AI/ML Engineer · Deep Learning Engineer · Computer Vision Engineer · Data Scientist
- **Interests:** computer vision and deep learning for sports analytics (badminton, football) and 2D-to-3D image reconstruction
- **Long-term:** Embodied AI, VLA models, World Models

## Featured projects

### [ResNet-50 Image Classification (PyTorch)](https://github.com/bzaat/pytorch-resnet50v1-implementation)
ResNet-50 built manually with `torch.nn`, used to compare **training from scratch vs. transfer learning** on the Oxford-IIIT Pet dataset (37 breeds, ~3.7k images).

| Setup | Epochs | Test accuracy |
|---|---|---|
| ResNet-50 from scratch | 50 | ~39% |
| ImageNet-pretrained, fine-tuned (layer4 + new head) | 10 | ~93% |

Takeaway: a large un-pretrained network overfits a small dataset, while a pretrained backbone reaches high accuracy in very few epochs.
Also includes: custom Dataset, augmentation, cosine LR with weight decay, TensorBoard logging with per-epoch confusion matrices, resumable checkpoints, `uv` setup and a Dockerfile.

**Stack:** PyTorch · Transfer Learning · Computer Vision

### [Melbourne Housing Price Prediction](https://github.com/bzaat/Real-Estate-Price-Analysis)
Comparison of 7 regression models with suburb-level encoding. XGBoost and LightGBM reached R² = 0.843 (log-price, 5-fold CV); suburb encoding raised Random Forest test R² from 0.815 to 0.835, checked with a shuffled-suburb control and SHAP.

**Stack:** Python · Scikit-learn · XGBoost · LightGBM · SHAP

## Publications

| Paper | Venue | Role | Status |
|---|---|---|---|
| [The Impact of Suburb-Level Encoding on Melbourne Housing Price Prediction](https://github.com/bzaat/Real-Estate-Price-Analysis/blob/main/Realestate%20(3).pdf) | SCI-2026 (8th Int. Conf. on Smart Computing and Informatics) | First author | Accepted / under publication |
| [Uncertainty-Triggered Active Sensing for UAV Maritime Rescue Prioritization under Wave Occlusion](https://drive.google.com/file/d/1FCH_cXJ0TVkZ_ojBMmjDJuSu9dBFo4y0/view?usp=sharing) | IECON 2026 | Third author | Accepted / under publication |

## Skills

- **Core areas:** Machine Learning, Deep Learning, Computer Vision, Predictive Modeling, Data Analysis
- **Languages:** Python, C (basic), SQL, LaTeX
- **Tools:** PyTorch, Scikit-learn, OpenCV, Git/GitHub, Linux, Bash, uv, Docker

## Lab activity

AITA Lab reading group on federated learning (10/2025–02/2026): reviewed and presented papers.

## Contact

Email: nguyentvvn12@gmail.com · [LinkedIn](https://www.linkedin.com/in/khanh-nguyen-pham-nguyen-7b822b371)
