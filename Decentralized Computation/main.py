import os
import threading

# Ensure these imports match your actual file structure
from datasetManager import DatasetManager
from modelRegistery import ModelRegistry
from modelPredictor import ModelPredictor
from consensusMechanism import ConsensusMechanism
from modelApi import create_app

class DistributedMLSystem:
    def __init__(self):
        # Initialize core components
        self.dataset_manager = DatasetManager()
        self.model_registry = ModelRegistry()
        self.model_predictor = ModelPredictor(
            dataset_manager=self.dataset_manager, 
            model_registry=self.model_registry
        )
        self.consensus_mechanism = ConsensusMechanism(
            model_predictor=self.model_predictor
        )
    
    def setup_system(self):
        # Ensure model registry is initialized
        if not os.path.exists('model_registry.json'):
            print("Initializing model registry...")
            self.model_registry.ensure_db()
        
        # Train initial models and log their accuracies
        print("Training Models...")
        model_accuracies = self.model_predictor.train_models()
        print("Model Accuracies:", model_accuracies)
    
    def test_predictions(self):
        # Test individual model predictions
        print("\n--- Individual Model Predictions ---")
        
        # Use the first test sample, but convert to list if it's a numpy array
        test_features = list(self.dataset_manager.X_test_scaled[0])
        
        for model_name in self.model_predictor.models.keys():
            prediction = self.model_predictor.predict(model_name, test_features)
            print(f"{model_name.replace('_', ' ').title()} Prediction: {self.dataset_manager.target_names[prediction]}")
        
        # Test Consensus Prediction
        print("\n--- Consensus Prediction ---")
        consensus_pred, individual_preds, weights = self.consensus_mechanism.aggregate_predictions(test_features)
        print("Consensus Prediction:", self.dataset_manager.target_names[consensus_pred])
        print("Individual Predictions:", {name: self.dataset_manager.target_names[pred] for name, pred in individual_preds.items()})
        print("Model Weights:", weights)
    
    def run_flask_server(self):
        # Create and run Flask app
        app = create_app()
        app.run(debug=True, use_reloader=False)

def main():
    # Create system instance
    ml_system = DistributedMLSystem()
    
    # Setup and initial training
    ml_system.setup_system()
    
    # Test predictions before API
    ml_system.test_predictions()
    
    # Run Flask server in a separate thread
    flask_thread = threading.Thread(target=ml_system.run_flask_server)
    flask_thread.start()

if __name__ == "__main__":
    main()