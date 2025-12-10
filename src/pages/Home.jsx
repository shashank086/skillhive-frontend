
import { useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap, Users, Video, LayoutDashboard, Star, CheckCircle, Mail } from 'lucide-react'
// Using public folder for logo to ensure it loads
const logo = '/skill-hive-icon.svg'

const Home = () => {
  const navigate = useNavigate()


  const handleGetStarted = () => {
    navigate('/login')
  }



  const features = [
    {
      icon: LayoutDashboard,
      title: 'Three Role-Based Dashboards',
      description:
        'Separate dashboards for Admin, Teacher, and Student with tailored features for each role.',
    },
    {
      icon: GraduationCap,
      title: 'Structured Learning',
      description:
        'Organized syllabus, study materials, and progress tracking to keep learning on track.',
    },
    {
      icon: Video,
      title: 'Video Learning',
      description:
        'High-quality video content managed by teachers and easily accessible for students.',
    },
    {
      icon: Users,
      title: 'Admin Insights',
      description:
        'Admins can monitor total students, teachers, courses, and engagement in one place.',
    },
  ]



  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "Skill Hive transformed the way I learn. The interactive video lessons and real-time feedback helped me master React in weeks!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "High School Teacher",
      content: "As a teacher, the dashboard features are a lifesaver. Tracking student progress and assigning resources has never been easier.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Lifelong Learner",
      content: "The quality of the content is top-notch. I love the community features where I can discuss topics with other students.",
      rating: 4
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 relative font-sans text-gray-800 selection:bg-primary-200 selection:text-primary-900">
      {/* Vibrant Background Texture */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/30 to-blue-400/30 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-yellow-300/30 to-orange-300/30 blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-pink-400/20 to-rose-400/20 blur-[80px] animate-bounce duration-[10s]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/40 shadow-sm transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <img src={logo} alt="SkillHive Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
              SkillHive
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-primary-600 transition-colors relative group">
                Features
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#resources" className="hover:text-primary-600 transition-colors relative group">
                Resources
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#testimonials" className="hover:text-primary-600 transition-colors relative group">
                Testimonials
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#about" className="hover:text-primary-600 transition-colors relative group">
                About
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            </nav>
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200 ring-4 ring-gray-100"
            >
              Login
            </button>
          </div>
        </div>
      </header >

      {/* Hero Section */}
      < main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32" >
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-100 text-primary-700 text-sm font-bold shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              Revolutionizing E-Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Unlock Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 animate-gradient-x">Smart Learning</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              A vibrant ecosystem for Admins, Teachers, and Students. Seamless management, engaging content, and tracked progress—all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300"
              >
                Get Started Now
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('resources').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-2xl bg-white text-gray-800 border border-gray-200 font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300"
              >
                Explore Resources
              </button>
            </div>

            <div className="pt-8 flex items-center gap-8 text-sm font-semibold text-gray-500 border-t border-gray-200/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-green-100 text-green-600">
                  <Users className="w-4 h-4" />
                </div>
                <span>Active Community</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                  <Video className="w-4 h-4" />
                </div>
                <span>Expert Content</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-purple-100 text-purple-600">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          {/* Hero Illustration - Dark Glass IDE Concept */}
          <div className="relative lg:h-[600px] flex items-center justify-center perspective-[2000px]">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-500/20 via-purple-500/20 to-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Main IDE Window */}
            <div className="relative z-20 w-full max-w-lg bg-[#0f172a] rounded-xl shadow-2xl shadow-black/50 border border-white/10 p-4 transform rotate-y-[-12deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out group">
              {/* Window Controls */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 px-3 py-1 bg-white/5 rounded-md text-[10px] font-mono text-gray-400 border border-white/5">
                  app.js
                </div>
              </div>

              {/* Code Content */}
              <div className="space-y-3 font-mono text-sm p-2">
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">1</span>
                  <p className="text-purple-400">import <span className="text-yellow-300">{`{ useState }`}</span> from <span className="text-green-400">'react'</span>;</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">2</span>
                  <p className="text-purple-400">const <span className="text-blue-400">App</span> = <span className="text-yellow-300">()</span> <span className="text-purple-400">=&gt;</span> <span className="text-yellow-300">{`{`}</span></p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">3</span>
                  <p className="pl-4 text-gray-300">const [<span className="text-blue-300">level</span>, <span className="text-blue-300">setLevel</span>] = <span className="text-blue-400">useState</span>(<span className="text-orange-400">0</span>);</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">4</span>
                  <p className="pl-4 text-gray-300"><span className="text-gray-500">// Start your journey</span></p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">5</span>
                  <p className="pl-4 text-purple-400">return <span className="text-yellow-300">(</span></p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">6</span>
                  <p className="pl-8 text-pink-400">&lt;LearningPlatform /&gt;</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">7</span>
                  <p className="pl-4 text-yellow-300">);</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 select-none">8</span>
                  <p className="text-yellow-300">{`}`}</p>
                </div>
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl"></div>
            </div>

            {/* Floating Video Player Card */}
            <div className="absolute -bottom-10 -left-10 z-30 w-64 bg-white rounded-2xl shadow-xl shadow-black/20 p-4 border border-gray-100 transform translate-z-20 animate-float-delayed">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full w-1/3 bg-primary-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">React Mastery</p>
                  <p className="text-[10px] text-gray-500">Lesson 3: Components</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white"></div>
                </div>
              </div>
            </div>

            {/* Floating Badge 1 */}
            <div className="absolute top-10 -right-5 z-30 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 transform rotate-12 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Top Rated</p>
                  <p className="text-[10px] text-gray-500">5.0 Stars</p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute bottom-40 -right-12 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 transform -rotate-6 animate-float-delayed">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-gray-900">Certified</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl p-12 flex flex-wrap justify-around gap-8 text-center">
            {[
              { label: 'Active Students', value: '15,000+', color: 'text-blue-600' },
              { label: 'Expert Instructors', value: '120+', color: 'text-purple-600' },
              { label: 'Total Courses', value: '450+', color: 'text-pink-600' },
              { label: 'Satisfaction Rate', value: '4.9/5', color: 'text-orange-500' },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className={`text - 4xl md: text - 5xl font - extrabold ${stat.color} `}>{stat.value}</h3>
                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Curated Learning Resources</h2>
            <p className="text-gray-600 text-xl leading-relaxed">
              Explore our vast library of high-quality materials designed to accelerate your learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive Video Lessons',
                desc: 'High-definition video content with interactive quizzes and real-time feedback.',
                color: 'from-blue-500 to-cyan-400',
                bg: 'bg-blue-50',
                icon: Video
              },
              {
                title: 'Comprehensive Notes',
                desc: 'Detailed PDF notes, cheat sheets, and summaries for every chapter.',
                color: 'from-purple-500 to-pink-400',
                bg: 'bg-purple-50',
                icon: BookOpen
              },
              {
                title: 'Live Mentorship',
                desc: 'Connect with expert teachers for doubt clearing sessions and guidance.',
                color: 'from-orange-500 to-yellow-400',
                bg: 'bg-orange-50',
                icon: Users
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative p-10 bg-white rounded-[2.5rem] shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute top - 0 right - 0 w - 64 h - 64 bg - gradient - to - br ${item.color} opacity - [0.03] rounded - bl - full group - hover: scale - 150 transition - transform duration - 700 ease - out`}></div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg shadow-gray-200 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                  {item.desc}
                </p>

                <a href="#" className="inline-flex items-center text-gray-900 font-bold group-hover:text-primary-600 transition-colors">
                  Learn more
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-10">
          <div className="bg-[#0f172a] rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-gray-900/20">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-primary-300 text-sm font-bold mb-6 backdrop-blur-md">
                  Why Choose Us
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Everything you need to <br /><span className="text-primary-400">excel in your studies</span></h2>
                <div className="space-y-8">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-6 group">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-primary-500/20 transition-colors duration-300">
                        <feature.icon className="w-6 h-6 text-primary-300 group-hover:text-primary-200" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-[2.5rem] border border-white/10 p-10 flex flex-col justify-center items-center text-center backdrop-blur-xl">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 animate-pulse">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Ready to start?</h3>
                <p className="text-gray-400 mb-10 text-lg max-w-xs mx-auto">Join thousands of students and teachers today and transform your learning experience.</p>
                <button
                  onClick={handleGetStarted}
                  className="w-full max-w-xs py-4 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Create Free Account
                </button>
                <p className="mt-6 text-sm text-gray-500">No credit card required</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-gray-600 text-lg">Don't just take our word for it. Hear from our community.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w - 5 h - 5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} `} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-primary-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white -z-10"></div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
              <div className="relative z-10 bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                  alt="Students learning together"
                  className="rounded-2xl w-full h-auto object-cover shadow-md"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 flex items-center gap-3 animate-float">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Community</p>
                    <p className="text-lg font-bold text-gray-900">Growing Fast</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-sm font-bold">
                About Skill Hive
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Empowering the Next Generation of <span className="text-primary-600">Learners</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Skill Hive is more than just an e-learning platform; it's a comprehensive ecosystem designed to bridge the gap between education and industry. We provide a seamless interface for students to learn, teachers to guide, and administrators to manage the entire process efficiently.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Our Mission', desc: 'To democratize education and make high-quality learning accessible to everyone, everywhere.' },
                  { title: 'Our Vision', desc: 'To become the world\'s leading platform for skill development and career advancement.' },
                  { title: 'Our Values', desc: 'Innovation, Integrity, Inclusivity, and Excellence in everything we do.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-1.5 h-full min-h-[3rem] bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Read Our Story
              </button>
            </div>
          </div>
        </section>



        {/* Newsletter / CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-br from-primary-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Stay Ahead of the Curve</h2>
              <p className="text-primary-100 text-lg">Join our newsletter to get the latest course updates, study tips, and exclusive offers delivered to your inbox.</p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="relative flex-grow">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-400/50"
                  />
                </div>
                <button type="button" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-primary-200/80">Thank you for being part of our growing community. Happy Learning!</p>
            </div>
          </div>
        </section>

      </main >
    </div >
  )
}

export default Home

