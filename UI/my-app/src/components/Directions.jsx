import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: lightgrey;
  display: grid;
  align-items: center;
  justify-content: flex-start;
  grid-auto-flow: row;
  width: 900px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  
  & > * {
    border: 1px solid black;
    padding: 8px;
    margin: 0;
  }
`

export const Directions = ({directionsData}) => {
  return <Wrapper>
    <Row>
      <h3>CodeId</h3>
      <h3>Name</h3>
      <h3>PointsId</h3>
    </Row>
    {
      directionsData.map((direction) => (
          <Row>
            <p>{direction.code}</p>
            <p>{direction.name}</p>
            <p>{direction.pointsid.join(', ')}</p>
          </Row>
        )
      )
    }
  </Wrapper>
};
