from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from datasetManager import *
from modelRegistery import *

class ModelPredictor:
    def __init__(self, dataset_manager, model_registry):
        self.dataset_manager = dataset_manager
        self.model_registry = model_registry
        self.models = {
            'random_forest': RandomForestClassifier(random_state=42),
            'gradient_boosting': GradientBoostingClassifier(random_state=42),
            'logistic_regression': LogisticRegression(random_state=42)
        }
    
    def train_models(self):
        results = {}
        for name, model in self.models.items():
            model.fit(self.dataset_manager.X_train_scaled, self.dataset_manager.y_train)
            accuracy = model.score(self.dataset_manager.X_test_scaled, self.dataset_manager.y_test)
            results[name] = accuracy
            self.model_registry.register_model(name)
        return results

    def predict(self, model_name, features):
        scaled_features = self.dataset_manager.scaler.transform([features])
        prediction = self.models[model_name].predict(scaled_features)[0]
        return prediction
