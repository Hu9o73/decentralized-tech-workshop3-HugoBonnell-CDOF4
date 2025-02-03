import os
import json

class ModelRegistry:
    def __init__(self, initial_balance=1000):
        self.models_db_path = 'model_registry.json'
        self.initial_balance = initial_balance
        self.ensure_db()
    
    def ensure_db(self):
        if not os.path.exists(self.models_db_path):
            with open(self.models_db_path, 'w') as f:
                json.dump({}, f)
    
    def register_model(self, model_name, initial_deposit=1000):
        with open(self.models_db_path, 'r+') as f:
            models = json.load(f)
            models[model_name] = {
                'balance': initial_deposit,
                'total_predictions': 0,
                'correct_predictions': 0
            }
            f.seek(0)
            json.dump(models, f, indent=4)
            f.truncate()
        return models[model_name]
    
    def update_model_performance(self, model_name, is_correct):
        with open(self.models_db_path, 'r+') as f:
            models = json.load(f)
            model = models.get(model_name)
            if model:
                model['total_predictions'] += 1
                model['correct_predictions'] += 1 if is_correct else 0
                
                if is_correct:
                    # Reward for accurate prediction
                    model['balance'] += 10
                else:
                    # Penalty for incorrect prediction
                    model['balance'] -= 50

                # Simple slashing mechanism
                if model['correct_predictions'] / model['total_predictions'] < 0.5:
                    model['balance'] -= 100  # Penalty for poor performance
                
                f.seek(0)
                json.dump(models, f, indent=4)
                f.truncate()
            return model
