import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import OptionCalculator from './components/OptionCalculator';

function App() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">期权定价计算器</h1>
          <OptionCalculator />
        </Col>
      </Row>
    </Container>
  );
}

export default App;