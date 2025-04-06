from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model
with open("logistic_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'CORS preflight successful'}), 200

    try:
        data = request.json
        print("Received data:", data)  # Debugging line
        
        # Ensure feature names match training data
        feature_names = ['cloud', 'humidity', 'windspeed', 'dewpoint']
        features = pd.DataFrame([data], columns=feature_names)

        # Predict using the trained model
        predicted_class = model.predict(features)[0]  # 0 or 1
        prediction_text = "Rain Expected" if predicted_class == 1 else "No Rain"

        return jsonify({'prediction': prediction_text})
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':


 port = int(os.environ.get("PORT", 10000))
 app.run(host='0.0.0.0', port=port)

