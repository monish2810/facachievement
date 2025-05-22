import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Book, Search, User } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            CSE Faculty Achievements Portal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A centralized platform to record, manage, and showcase the academic achievements of our esteemed faculty members.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" variant="secondary">
                Faculty Login
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                <Search className="w-5 h-5 mr-2" />
                Search Faculty
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <User className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Faculty Submission</h3>
              <p className="text-gray-600">
                Faculty members can easily submit their achievements, including certifications, awards, and publications.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Book className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">HOD Review</h3>
              <p className="text-gray-600">
                Department heads review and verify achievement submissions to maintain accuracy and quality.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-primary-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Public Showcase</h3>
              <p className="text-gray-600">
                Approved achievements are showcased publicly, highlighting the accomplishments of our faculty.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">CSE Department Excellence</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">40+</div>
              <div className="text-gray-600">Faculty Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">250+</div>
              <div className="text-gray-600">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">120+</div>
              <div className="text-gray-600">Awards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">75+</div>
              <div className="text-gray-600">Certifications</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-accent-50 border border-accent-100 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Are you a student or visitor?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Browse through our faculty directory and discover their academic achievements and contributions.
            </p>
            <Link to="/search">
              <Button size="lg" variant="primary">
                <Search className="w-5 h-5 mr-2" />
                Search Faculty Achievements
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;