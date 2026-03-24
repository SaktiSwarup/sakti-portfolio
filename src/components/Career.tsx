import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior Software Engineer</h4>
                <h5>ApMoSys Technologies Pvt. Ltd.</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Developed and maintained enterprise applications using Java,
              Spring, Angular, and SQL databases. Built modules for monitoring,
              employee operations, and test management.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer -: Project Owner</h4>
                <h5>Monitoring and Automation Platforms</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Owned delivery for multiple internal products including monitoring
              modules, scheduler workflows, escalation systems, and dashboards
              with high focus on quality and maintainability.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Team Lead / Full Stack Java Developer</h4>
                <h5>ApMoSys Technologies Pvt. Ltd.</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Leading requirement analysis, technical solution design, and
              implementation guidance for microservices-based applications.
              Collaborating across teams for CI/CD, release planning, and
              production-ready deployments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
