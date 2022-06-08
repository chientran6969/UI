import styled from "@emotion/styled";

import Container from "./component/Container";
import RoundedButton from "./component/RoundedButton";

export const StyledContainer = styled(Container)`
  align-items: center;
  margin-top: 100px;
`;

export const FormWrapper = styled.div`
  min-width: 400px;
  @media (max-width: 600px) {
    min-width: 0;
  }
`;

export const FormHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

export const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    > * {
      margin-top: 5px;
    }
  }
  .MuiButton-root {
    @media (max-width: 600px) {
      width: 100%;
    }
  }
`;

export const GoogleButton = styled(RoundedButton)`
  svg {
    margin-right: 10px;
    fill: white;
  }
`;

export const FormFooter = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  a {
    text-transform: capitalize;
  }

  .MuiButton-text {
    font-weight: bold;
    font-size: 15px;
  }
`;
