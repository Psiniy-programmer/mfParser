import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  justify-content: flex-start;
  grid-auto-flow: row;
  min-width: 640px;
`;
const Row = styled.div`
  background-color: lightgrey;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin: 0;
  
  & > * {
    border: 1px solid black;
    padding: 8px;
    margin: 0;
  }
`

const ValueCell = styled.p`
  background-color: ${({ isOptional }) => isOptional && 'darkcyan'};
`;

export const Points = ({pointsData}) => {
  return <Wrapper>
    <Row>
      <h3>Id</h3>
      <h3>CodeId</h3>
      <h3>SubjectName</h3>
      <h3>Value</h3>
      <h3>isOptional</h3>
    </Row>
    {
      pointsData.map((point) => (
          <Row>
            <p>{point.id}</p>
            <p>{point.codeid ?? '???'}</p>
            <p>{point.subjectname}</p>
            <ValueCell isOptional={point.isoptional}>{point.value}</ValueCell>
            <p>{point.isoptional.toString()}</p>
          </Row>
        )
      )
    }
  </Wrapper>
};
