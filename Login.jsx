import React from 'react';
import trainerImage from './assets/trainer.webp';
import workout1 from './assets/workout1.webp';   
import workout2 from './assets/workout2.webp';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center px-6">
      
      <nav className="w-full max-w-6xl flex justify-between items-center py-6">
        <div className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="dumbbell">🏋️‍♂️</span> FitX Fitness
        </div>
        <div className="space-x-6 text-gray-700 font-medium">
          <a href="#programs" className="hover:text-blue-600">Programs</a>
          <a href="#testimonials" className="hover:text-blue-600">Testimonials</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
          <button className="bg-white text-blue-600 border border-blue-500 px-4 py-2 rounded hover:bg-blue-50">
            Login
          </button>
        </div>
      </nav>

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg flex flex-col md:flex-row overflow-hidden">
       
        <div className="md:w-1/2 p-10 flex flex-col justify-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Achieve Your Best with FitX Fitness</h1>
          <p className="text-gray-600">
            Join a community-driven fitness journey with personalized training plans and expert coaches.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full w-fit">
            Get Started
          </button>
        </div>

        <div className="md:w-1/2 bg-blue-200 flex items-center justify-center p-10 relative">
          <img
            src={trainerImage}
            alt="Trainer Illustration"
            className="w-64 h-auto object-contain"
          />
        </div>
      </div>

      <div className="mt-10 flex gap-6">
        <img
          src={workout1}
          alt="Workout 1"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
        <img
          src={workout2}
          alt="Workout 2"
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />
      </div>
    </div>
  );
}

export default App;
