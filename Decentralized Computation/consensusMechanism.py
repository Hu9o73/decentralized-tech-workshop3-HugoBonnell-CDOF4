import numpy as np
import json

class ConsensusMechanism:
    def __init__(self, model_predictor):
        self.model_predictor = model_predictor
    
    def aggregate_predictions(self, features):
        predictions = {}
        model_weights = {}
        
        try:
            with open('model_registry.json', 'r') as f:
                models_data = json.load(f)
        except FileNotFoundError:
            # If no registry exists, create equal weights
            model_names = list(self.model_predictor.models.keys())
            num_models = len(model_names)
            model_weights = {name: 1/num_models for name in model_names}
        
        for model_name in self.model_predictor.models.keys():
            # Predict using each model
            prediction = self.model_predictor.predict(model_name, features)
            predictions[model_name] = prediction
            
            # Calculate model weight based on past performance
            model_info = models_data.get(model_name, {})
            total_predictions = model_info.get('total_predictions', 1)
            correct_predictions = model_info.get('correct_predictions', 0)
            
            # Prevent division by zero
            if total_predictions > 0:
                model_weights[model_name] = correct_predictions / total_predictions
            else:
                # Default to equal weight if no predictions
                model_weights[model_name] = 1 / len(self.model_predictor.models)
        
        # Normalize weights if they're not already normalized
        total_weight = sum(model_weights.values())
        normalized_weights = {k: v/total_weight for k, v in model_weights.items()}
        
        # Consensus prediction logic
        unique_predictions = set(predictions.values())
        consensus_prediction = max(unique_predictions, 
                                   key=lambda pred: sum(
                                       normalized_weights.get(model, 0) 
                                       for model, p in predictions.items() 
                                       if p == pred
                                   ))
        
        return consensus_prediction, predictions, normalized_weights
