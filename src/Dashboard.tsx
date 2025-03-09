import { Row, ButtonCard } from '@hakit/components';
import { useHass, useEntity } from "@hakit/core";
import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const { getAllEntities } = useHass();
  const [currentPage, setCurrentPage] = useState(0);
  const [date, setDate] = useState(new Date());
  
  // Get weather entity
  const weatherEntity = useEntity('weather.forecast_home');
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };
  
  // Format date as "Friday, March 25th"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).replace(/(\d+)(?=(st|nd|rd|th))/, '$1$2');
  };
  
  // Weather icon mapping
  const weatherIconMap: Record<string, string> = {
    'clear-night': 'mdi-weather-night',
    'cloudy': 'mdi-weather-cloudy',
    'fog': 'mdi-weather-fog',
    'hail': 'mdi-weather-hail',
    'lightning': 'mdi-weather-lightning',
    'lightning-rainy': 'mdi-weather-lightning-rainy',
    'partlycloudy': 'mdi-weather-partly-cloudy',
    'pouring': 'mdi-weather-pouring',
    'rainy': 'mdi-weather-rainy',
    'snowy': 'mdi-weather-snowy',
    'snowy-rainy': 'mdi-weather-snowy-rainy',
    'sunny': 'mdi-weather-sunny',
    'windy': 'mdi-weather-windy',
    'windy-variant': 'mdi-weather-windy-variant',
    'exceptional': 'mdi-alert-circle-outline',
  };
  
  // Weather background mapping
  const weatherBackgroundMap: Record<string, string> = {
    'clear-night': 'url("https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=1000&auto=format&fit=crop")',
    'cloudy': 'url("https://images.unsplash.com/photo-1611928482473-7b27d24eab80?q=80&w=1000&auto=format&fit=crop")',
    'fog': 'url("https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1000&auto=format&fit=crop")',
    'hail': 'url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1000&auto=format&fit=crop")',
    'lightning': 'url("https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?q=80&w=1000&auto=format&fit=crop")',
    'lightning-rainy': 'url("https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1000&auto=format&fit=crop")',
    'partlycloudy': 'url("https://images.unsplash.com/photo-1422034681339-7b5dbb46db18?q=80&w=1000&auto=format&fit=crop")',
    'pouring': 'url("https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1000&auto=format&fit=crop")',
    'rainy': 'url("https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1000&auto=format&fit=crop")',
    'snowy': 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop")',
    'snowy-rainy': 'url("https://images.unsplash.com/photo-1612208695882-02f2322b7fee?q=80&w=1000&auto=format&fit=crop")',
    'sunny': 'url("https://images.unsplash.com/photo-1541119638723-c51cbe2262aa?q=80&w=1000&auto=format&fit=crop")',
    'windy': 'url("https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1000&auto=format&fit=crop")',
    'windy-variant': 'url("https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1000&auto=format&fit=crop")',
    'exceptional': 'url("https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1000&auto=format&fit=crop")',
  };
  
  // Button configurations - all using the same entity as placeholder
  const buttons = [
    { title: 'Camera', icon: 'mdi:camera', entity: 'light.desk_upstairs', service: 'toggle' },
    { title: 'Armed', icon: 'mdi:shield-check', entity: 'light.desk_upstairs', service: 'toggle' },
    { title: 'Voice Calls', icon: 'mdi:phone', entity: 'light.desk_upstairs', service: 'toggle' },
    { title: 'Lights', icon: 'mdi:lightbulb', entity: 'light.desk_upstairs', service: 'toggle' },
    { title: 'TV', icon: 'mdi:television', entity: 'light.desk_upstairs', service: 'toggle' },
    { title: 'Music', icon: 'mdi:music', entity: 'light.desk_upstairs', service: 'toggle' },
  ];

  // Calculate which buttons to show (3 per page)
  const buttonsPerPage = 3;
  const maxPages = Math.ceil(buttons.length / buttonsPerPage);
  const startIndex = currentPage * buttonsPerPage;
  const visibleButtons = buttons.slice(startIndex, startIndex + buttonsPerPage);

  // Handle swipe navigation
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % maxPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + maxPages) % maxPages);
  };

  // Get weather state and temperature
  const weatherState = weatherEntity?.state || 'sunny';
  const temperature = weatherEntity?.attributes?.temperature || 22;
  const humidity = weatherEntity?.attributes?.humidity || 10;
  
  // Get weather icon and background
  const weatherIcon = weatherIconMap[weatherState] || 'mdi-weather-sunny';
  const weatherBackground = weatherBackgroundMap[weatherState] || weatherBackgroundMap['sunny'];

  return (
    <div className="dashboard">
      <div 
        className="dashboard-top" 
        style={{ 
          backgroundImage: weatherBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="weather-background-overlay"></div>
        
        {/* Custom info card that combines weather and time */}
        <div className="info-card">
          <div className="weather-row">
            <i className={`mdi ${weatherIcon}`}></i>
            <span className="temperature">{temperature}°C</span>
          </div>
          
          <div className="time-row">
            {formatTime(date)}
          </div>
          
          <div className="date-row">
            {formatDate(date)}
          </div>
          
          <div className="weather-details">
            <span className="weather-detail"><i className="mdi mdi-water"></i> {Math.round(humidity)}%</span>
            <span className="weather-detail"><i className="mdi mdi-weather-windy"></i> {weatherEntity?.attributes?.wind_speed || 5} km/h</span>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div 
          className="buttons-container"
          onTouchStart={(e) => {
            const touchStart = e.touches[0].clientX;
            e.currentTarget.setAttribute('data-start-x', touchStart.toString());
          }}
          onTouchEnd={(e) => {
            const touchStart = parseFloat(e.currentTarget.getAttribute('data-start-x') || '0');
            const touchEnd = e.changedTouches[0].clientX;
            const diff = touchEnd - touchStart;
            
            if (diff > 50) {
              handlePrevPage();
            } else if (diff < -50) {
              handleNextPage();
            }
          }}
        >
          <Row fullWidth>
            {visibleButtons.map((button, index) => (
              <ButtonCard
                key={index}
                title={button.title}
                entity={button.entity}
                service={button.service}
                icon={button.icon}
                className="minimal-button"
              />
            ))}
          </Row>
        </div>
        
        <div className="pagination-dots">
          {Array.from({ length: maxPages }).map((_, index) => (
            <span 
              key={index} 
              className={`dot ${currentPage === index ? 'active' : ''}`}
              onClick={() => setCurrentPage(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;