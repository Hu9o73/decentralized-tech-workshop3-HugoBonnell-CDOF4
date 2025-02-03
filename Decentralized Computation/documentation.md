# Decentralized Machine Learning Simulation

## Project Overview

This project simulates a decentralized machine learning system using the Iris dataset, demonstrating key concepts of distributed computing, consensus mechanisms, and economic incentives in a machine learning context.

## Conceptual Simulation of Distributed Network

### Network Simulation Approach

In a real distributed system, multiple computers would independently train and share models. Our simulation replicates this environment locally through several key mechanisms:

1. **Multiple Independent Models**
   - We train three different models (Random Forest, Gradient Boosting, Logistic Regression)
   - Each model operates independently, just as different nodes in a distributed network would

2. **Performance Tracking**
   - A JSON-based registry tracks each model's performance
   - Models have a virtual "balance" that can increase or decrease based on prediction accuracy
   - This simulates economic incentives in a decentralized system

3. **Consensus Mechanism**
   - Aggregates predictions from multiple models
   - Weights models based on their historical performance
   - Dynamically adjusts model influence

## System Architecture

### Components

1. **DatasetManager**
   - Prepares Iris dataset
   - Handles data splitting and feature scaling

2. **ModelRegistry**
   - Tracks model performance
   - Manages economic incentive mechanism
   - Stores model states in JSON database

3. **ModelPredictor**
   - Trains multiple machine learning models
   - Provides individual model predictions

4. **ConsensusMechanism**
   - Aggregates predictions
   - Calculates model weights
   - Determines consensus prediction

## Testing the System

### Prerequisites
- Python 3.8+
- Required libraries:
  ```
  pip install scikit-learn flask numpy
  ```

### Running the System

1. **Full System Test**
   ```bash
   python main.py
   ```
   This will:
   - Train models
   - Show individual predictions
   - Demonstrate consensus mechanism
   - Start Flask API server

2. **API Prediction Testing**
   ```bash
   # Using curl
   curl -X POST http://localhost:5000/predict \
        -H "Content-Type: application/json" \
        -d '{"model": "random_forest", "features": [5.1, 3.5, 1.4, 0.2]}'
   ```

### Experimental Scenarios

**Economic Incentive Simulation**
   - Check `model_registry.json` to see how model "balances" change
   - Track how poorly performing models get penalized
   - Note: As all models perform well on this dataset, we simulate model's failure.
      - No matter the output, when making a POST request for a give model, it has 30% chance to be considered a failure.
      - This is to let you see how balances can change !

## Key Simulation Techniques

### Network Simulation Strategies

1. **Local Multimodel Approach**
   - Multiple models trained on same dataset
   - Independent prediction capabilities
   - Simulates distributed computation without actual network

2. **Weighted Consensus**
   - Dynamically adjust model influence
   - Reward accurate predictions
   - Penalize consistent poor performance

3. **Economic Incentive Layer**
   - Virtual "balance" for each model
   - Automatic adjustment based on prediction accuracy
   - Encourages high-quality contributions

## Limitations of Current Simulation

- Purely local simulation
- No actual network communication
- Simplified economic model
- Simulated performance tracking

## Potential Future Extensions

1. Implement actual network communication
2. More sophisticated consensus algorithms
3. Advanced economic incentive models
4. Support for external model contributions
