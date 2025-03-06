from flask import Flask, render_template, redirect, url_for
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/movie/<int:movie_id>')
def movie_detail(movie_id):
    return render_template('movie.html', movie_id=movie_id)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 