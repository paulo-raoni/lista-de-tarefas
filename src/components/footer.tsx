import styled from 'styled-components'

const Footer = () => {
  const StyledFootWrapper = styled.div`
    margin-top: 40%;
    > footer {
      background: green;
    }
  `

  return (
    <StyledFootWrapper>
      <div className="container center">
        Copyright © 2018 by <a href="https://github.com/paulo-raoni">Paulo Raoni</a>
      </div>
    </StyledFootWrapper>
  )
}

export default Footer
