import { Car, Smartphone, Clock, CreditCard, User, ChevronDown, LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from './database/database';
import { useEffect, useState, useRef } from 'react';


function App() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const roles = [
    {
      title: "user",
    },
    {
      title: "staff",
    },
    {
      title: "admin",
    }
  ];


  const handleLogout = async () => {
    const now = new Date().toISOString(); // current timestamp
    try {
      // Find the latest active login entry for the user
      const record = await db.login
        .where('usr')
        .equals(data[0].usr)
        .filter(r => r.status === "logged in")
        .last();

      if (record) {
        await db.login.update(record.id, {
          exit: now,
          status: "logged out"
        });
      }

      navigate('/', { replace: true });
      setData([]);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.login
        .where('status')
        .equals("logged in")
        .toArray();

      setData(data);
    };
    fetchData();
    
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  //navigation when logged in
  const onLoggedinClick = () => {
    if (data[0]?.role === "user") {
      navigate('/user', { state: { usr: data[0]?.usr, role: data[0]?.role } })
    }
    else if (data[0]?.role === "staff") {
      navigate('/staff', { state: { usr: data[0]?.usr, role: data[0]?.role } })
    }
    else {
      navigate('/admin', { state: { usr: data[0]?.usr, role: data[0]?.role } })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-app">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-1 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">
                Quick Park
              </span>
            </div>

            {data.length === 1 && (
              <div className="flex items-center space-x-6">
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    <div className="w-9 h-9 bg-gradient-to-r from-slate-800 to-blue-500 rounded-full flex items-center justify-center hover:from-slate-900 hover:to-blue-600 transition-all duration-200">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-r from-slate-800 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-l font-semibold text-slate-800">{data[0].usr}</span>
                            <span className="text-l text-slate-500 capitalize">{data[0].role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex  text-medium items-center space-x-3 px-3 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 text-slate-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Heading Section */}
      <section className="pt-10 pb-7 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-3xl font-bold mb-6 text-slate-800 leading-tight">
            Never Hunt to Park
          </h1>
          <h1 className="text-medium md:text-xl font-bold mb-6 text-blue-600 leading-tight">
            Quick Park takes the stress out of parking by helping you instantly find, reserve the spots
          </h1>
        </div>
      </section>

      {/* Roles Section */}
      {data.length === 0 && (
        <div className="flex justify-center py-4 px-4 bg-white border-b border-slate-200 shadow-sm">
          <div className="w-full md:w-1/3 border border-slate-300 rounded-2xl p-6 bg-white shadow-md">
            <section id="features">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-3">
                  Choose a Role
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2">
                {roles.map((feature, index) => (
                  <div
                    key={index}
                    className="group p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => navigate('/login', { state: { role: feature.title } })}
                  >
                    <h3 className="text-sm text-center font-semibold text-slate-700 group-hover:text-blue-600">
                      {feature.title.toUpperCase()}
                    </h3>
                  </div>
                ))}
              </div>

            </section>
          </div>
        </div>
      )}
      {data.length === 1 && (
        <div className="flex justify-center bg-white items-center min-h-[200px]">
          <div
            className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            onClick={onLoggedinClick}
          >
            <h3 className="text-small font-semibold text-slate-700 group-hover:text-blue-600 flex items-center space-x-2">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </h3>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section id="features" className="py-10 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-l font-bold mb-2 text-slate-800">1. Search & Find</h3>
              <p className="text-slate-600">Search and locate available parking spots</p>
            </div>
            <div className="text-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-l font-bold mb-2 text-slate-800">2. Book Instantly</h3>
              <p className="text-slate-600">Reserve your preferred spot with just a few taps</p>
            </div>
            <div className="text-center group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-l font-bold mb-2 text-slate-800">3. Park</h3>
              <p className="text-slate-600">Hassle-free parking experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Quick Park</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;