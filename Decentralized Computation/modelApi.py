from flask import Flask, request, jsonify
from datasetManager import *
from modelRegistery import *
from modelPredictor import *
import numpy as np

def create_app():
    app = Flask(__name__)
    dataset_manager = DatasetManager()
    model_registry = ModelRegistry()
    predictor = ModelPredictor(dataset_manager, model_registry)
    
    model_accuracies = predictor.train_models()
    print("Model Accuracies:", model_accuracies)
    
    @app.route('/predict', methods=['POST'])
    def predict():
        data = request.json
        model_name = data.get('model', 'random_forest')
        features = data.get('features')
        
        prediction = predictor.predict(model_name, features)
        prediction_name = dataset_manager.target_names[prediction]
        
        # Simulated correctness check (in real scenario, would need ground truth)
        is_correct = np.random.random() > 0.3  # Simulated 70% accuracy
        model_registry.update_model_performance(model_name, is_correct)
        
        return jsonify({
            'prediction': prediction_name,
            'model': model_name
        })
    
    return app