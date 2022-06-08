import styled from '@emotion/styled';
import Container from '@mui/material/Container';

const StyledContainer = styled(Container)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 650px) {
    margin-bottom: 60px;
  }
`;

export default StyledContainer;
