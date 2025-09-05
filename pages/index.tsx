import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';

// Hero Section Component
const HeroSection = () => {
  const router = useRouter();
  return (
    <section className='hero-section bg-gradient-primary text-white py-5'>
      <Container>
        <Row className='align-items-center min-vh-75'>
          <Col lg='6' className='text-center text-lg-start'>
            <h1 className='display-4 fw-bold mb-4'>
              NextJS Enterprise Dashboard
            </h1>
            <p className='lead mb-4'>
              A modern, responsive, and feature-rich dashboard built with Next.js,
              React 18, and the latest web technologies. Perfect for enterprise
              applications.
            </p>
            <div className='d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start'>
              <Button
                color='light'
                size='lg'
                className='px-4 py-3'
                onClick={() => router.push('/admin/dashboard')}
              >
                <i className='fas fa-tachometer-alt me-2'></i>
                View Dashboard
              </Button>
              <Button
                color='outline-light'
                size='lg'
                className='px-4 py-3'
                onClick={() => router.push('/auth/login')}
              >
                <i className='fas fa-sign-in-alt me-2'></i>
                Get Started
              </Button>
            </div>
          </Col>
          <Col lg='6' className='text-center'>
            <div className='hero-image mt-5 mt-lg-0'>
              <i className='fas fa-chart-line display-1 text-white-50'></i>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: 'fas fa-rocket',
      title: 'High Performance',
      description:
        'Built with Next.js 14 and React 18 for optimal performance and user experience.',
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Responsive Design',
      description:
        'Fully responsive design that works perfectly on all devices and screen sizes.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Reliable',
      description:
        'Enterprise-grade security with authentication, authorization, and data protection.',
    },
    {
      icon: 'fas fa-palette',
      title: 'Modern UI/UX',
      description:
        'Beautiful, modern interface with Preline UI components and smooth animations.',
    },
    {
      icon: 'fas fa-cogs',
      title: 'Easy Customization',
      description:
        'Highly customizable with centralized configuration and modular architecture.',
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Analytics Ready',
      description:
        'Built-in analytics, charts, and reporting capabilities for data-driven decisions.',
    },
  ];

  return (
    <section className='features-section py-5'>
      <Container>
        <Row className='text-center mb-5'>
          <Col>
            <h2 className='display-5 fw-bold mb-3'>
              Why Choose Our Dashboard?
            </h2>
            <p className='lead text-muted'>
              Built with modern technologies and best practices for enterprise
              applications
            </p>
          </Col>
        </Row>
        <Row>
          {features.map((feature, index) => (
            <Col md='6' lg='4' key={index} className='mb-4'>
              <Card className='h-100 border-0 shadow-sm'>
                <CardBody className='text-center p-4'>
                  <div className='feature-icon mb-3'>
                    <i
                      className={`${feature.icon} text-primary feature-icon-size`}
                    ></i>
                  </div>
                  <CardTitle tag='h5' className='fw-bold mb-3'>
                    {feature.title}
                  </CardTitle>
                  <CardText className='text-muted'>
                    {feature.description}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { number: '99.9%', label: 'Uptime' },
    { number: '50K+', label: 'Users' },
    { number: '100+', label: 'Features' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <section className='stats-section bg-light py-5'>
      <Container>
        <Row className='text-center'>
          {stats.map((stat, index) => (
            <Col md='3' key={index} className='mb-4 mb-md-0'>
              <div className='stat-item'>
                <h3 className='display-4 fw-bold text-primary mb-2'>
                  {stat.number}
                </h3>
                <p className='text-muted mb-0'>{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const router = useRouter();
  return (
    <section className='cta-section bg-primary text-white py-5'>
      <Container>
        <Row className='text-center'>
          <Col>
            <h2 className='display-5 fw-bold mb-3'>Ready to Get Started?</h2>
            <p className='lead mb-4'>
              Join thousands of users who trust our dashboard for their business
              needs.
            </p>
            <Button
              color='light'
              size='lg'
              className='px-5 py-3'
              onClick={() => router.push('/auth/register')}
            >
              <i className='fas fa-user-plus me-2'></i>
              Create Account
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

// Footer Component
const Footer = () => (
  <footer className='footer bg-dark text-white py-5'>
    <Container>
      <Row>
        <Col md='6' className='mb-4 mb-md-0'>
          <h5 className='fw-bold mb-3'>NextJS Enterprise Dashboard</h5>
          <p className='text-muted mb-3'>
            A modern, responsive dashboard built with the latest web
            technologies for enterprise applications.
          </p>
          <div className='social-links'>
            <a href='#' className='text-white me-3'>
              <i className='fab fa-github'></i>
            </a>
            <a href='#' className='text-white me-3'>
              <i className='fab fa-twitter'></i>
            </a>
            <a href='#' className='text-white me-3'>
              <i className='fab fa-linkedin'></i>
            </a>
          </div>
        </Col>
        <Col md='3' className='mb-4 mb-md-0'>
          <h6 className='fw-bold mb-3'>Quick Links</h6>
          <ul className='list-unstyled'>
            <li className='mb-2'>
              <Link
                href='/admin/dashboard'
                className='text-muted text-decoration-none'
              >
                Dashboard
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                href='/admin/profile'
                className='text-muted text-decoration-none'
              >
                Profile
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                href='/admin/tables'
                className='text-muted text-decoration-none'
              >
                Tables
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                href='/admin/maps'
                className='text-muted text-decoration-none'
              >
                Maps
              </Link>
            </li>
          </ul>
        </Col>
        <Col md='3'>
          <h6 className='fw-bold mb-3'>Support</h6>
          <ul className='list-unstyled'>
            <li className='mb-2'>
              <Link
                href='/auth/login'
                className='text-muted text-decoration-none'
              >
                Login
              </Link>
            </li>
            <li className='mb-2'>
              <Link
                href='/auth/register'
                className='text-muted text-decoration-none'
              >
                Register
              </Link>
            </li>
            <li className='mb-2'>
              <a href='#' className='text-muted text-decoration-none'>
                Documentation
              </a>
            </li>
            <li className='mb-2'>
              <a href='#' className='text-muted text-decoration-none'>
                Contact
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <hr className='my-4' />
      <Row className='align-items-center'>
        <Col md='6'>
          <p className='text-muted mb-0'>
            © {new Date().getFullYear()} NextJS Enterprise Dashboard. All
            rights reserved.
          </p>
        </Col>
        <Col md='6' className='text-md-end'>
          <Link href='#' className='text-muted text-decoration-none me-3'>
            Privacy Policy
          </Link>
          <Link href='#' className='text-muted text-decoration-none'>
            Terms of Service
          </Link>
        </Col>
      </Row>
    </Container>
  </footer>
);

// Main Homepage Component
const Homepage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>NextJS Enterprise Dashboard - Modern Business Dashboard</title>
        <meta
          name='description'
          content='A modern, responsive, and feature-rich dashboard built with Next.js, React 18, and the latest web technologies. Perfect for enterprise applications.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Navigation Header */}
      <nav className='navbar navbar-expand-lg navbar-dark bg-primary fixed-top'>
        <Container>
          <a role='button' className='navbar-brand fw-bold' onClick={(e) => { e.preventDefault(); router.push('/'); }} href='/'>
            <i className='fas fa-chart-line me-2'></i>
            NextJS Dashboard
          </a>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <a className='nav-link' role='button' onClick={(e) => { e.preventDefault(); router.push('/admin/dashboard'); window.scrollTo(0,0); }} href='/admin/dashboard'>
                  Dashboard
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' role='button' onClick={(e) => { e.preventDefault(); router.push('/admin/profile'); window.scrollTo(0,0); }} href='/admin/profile'>
                  Profile
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' role='button' onClick={(e) => { e.preventDefault(); router.push('/auth/login'); window.scrollTo(0,0); }} href='/auth/login'>
                  Login
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' role='button' onClick={(e) => { e.preventDefault(); router.push('/auth/register'); window.scrollTo(0,0); }} href='/auth/register'>
                  <Button color='light' size='sm' className='px-3'>
                    Get Started
                  </Button>
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className='content-offset-top'>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
};

export default Homepage;
