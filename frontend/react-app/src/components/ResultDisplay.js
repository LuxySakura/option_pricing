import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const ResultDisplay = ({ result }) => {
  return (
    <Card className="result-card">
      <Card.Header className="bg-success text-white">
        <h3 className="mb-0">计算结果</h3>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h4>期权类型</h4>
            <p className="fs-5">{result.option_type}</p>
          </Col>
          <Col md={6}>
            <h4>期权价格</h4>
            <p className="fs-5 fw-bold">{result.option_price.toFixed(4)}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ResultDisplay;