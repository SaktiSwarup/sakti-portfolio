import { useState, useCallback, useMemo } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useTheme } from "../context/ThemeProvider";
import { themeAccentHex } from "../theme/themes";

const buildProjectImage = (
  title: string,
  category: string,
  accentHex: string
) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0b1222"/>
          <stop offset="100%" stop-color="#12243b"/>
        </linearGradient>
      </defs>
      <rect width="900" height="540" fill="url(#bg)"/>
      <rect x="24" y="24" width="852" height="492" rx="22" fill="none" stroke="${accentHex}" stroke-opacity="0.45"/>
      <text x="68" y="250" fill="#ecfeff" font-size="52" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
      <text x="68" y="305" fill="${accentHex}" font-size="28" font-family="Arial, Helvetica, sans-serif" opacity="0.9">${category}</text>
      <circle cx="795" cy="105" r="58" fill="${accentHex}" fill-opacity="0.15"/>
      <circle cx="745" cy="452" r="72" fill="${accentHex}" fill-opacity="0.12"/>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const projectDefs = [
  {
    title: "ApMoSys Employee Portal",
    category: "Microservices Employee Management",
    tools: "Angular, Java, Spring Boot, Spring Data JPA, MySQL, REST APIs",
  },
  {
    title: "ApMoSys Monitoring Portal",
    category: "Application Monitoring and Reporting",
    tools: "AngularJS, Java, Spring Data JPA, MySQL, Performance Dashboards",
  },
  {
    title: "RPA Portal",
    category: "Automation Bot Operations",
    tools: "Java, Angular, MySQL, Scheduler Logic, Reporting Dashboards",
  },
  {
    title: "APTMT",
    category: "Test Management and Defect Automation",
    tools: "Java, Angular, Jenkins, Jira/Bugzilla/Mantis APIs, REST APIs",
  },
  {
    title: "EUCMDB - Axis Bank",
    category: "CMDB Customization and Security",
    tools: "PHP, MySQL, JavaScript, AJAX, TWIG, Asset Management",
  },
  {
    title: "Lease Hub - Mahindra Finance",
    category: "Sales and Workflow Platform",
    tools: "Java, Angular, MySQL, REST APIs, CI/CD Deployment",
  },
];

const Work = () => {
  const { theme } = useTheme();
  const accent = themeAccentHex[theme];

  const projects = useMemo(
    () =>
      projectDefs.map((p) => ({
        ...p,
        image: buildProjectImage(p.title, p.category, accent),
      })),
    [accent]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={project.title}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
