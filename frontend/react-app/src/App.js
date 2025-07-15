import { Container, Row, Col } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import OptionCalculator from './components/OptionCalculator';

function App() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Typography variant="h4" component="h1"
           sx={{
              fontWeight: 'bold',         // 设置粗体
              textAlign: 'center',        // 居中对齐
              mb: 1,                      // margin-bottom: 1 * 8px = 8px
              textTransform: 'uppercase', // 文本大写
              letterSpacing: 2,           // 字符间距
              color: '#ffffff'
            }}
           gutterBottom>
            欧式期权定价计算器
          </Typography>
        </Col>
        <OptionCalculator />
      </Row>
      
    </Container>
  );
}

export default App;