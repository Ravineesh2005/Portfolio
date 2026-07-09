from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'GET':
        return render_template('contact.html')
    # Placeholder for contact form processing
    data = request.json if request.is_json else request.form
    print(f"Received message: {data}")
    return jsonify({"status": "success", "message": "Transmission complete"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
