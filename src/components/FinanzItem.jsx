// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// components
import MatchScoreItem from '@components/MatchScoreItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Spring from '@components/Spring';

// hooks
import {useState} from 'react';

// assets
import preview from '@assets/preview.webp';

const StyledAccordion = styled(Accordion)`
  background: ${theme('theme', {
    light: 'var(--widget) !important',
    dark: 'var(--border) !important'
  })};
  box-shadow: 0 1px 8px rgba(110, 110, 110, 0.1) !important;
  border-radius: 4px !important;
  margin: 0 !important;
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  padding: 0 !important;


  .MuiAccordionSummary-content {
    margin: 0 !important;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 0 !important;
  aspect-ratio: 334 / 210;
  overflow: hidden;
  border-radius: 4px;
`;

const FinanzItem = ({data, index}) => {
    const [expanded, setExpanded] = useState(undefined);

    // manually handle accordion expansion
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    return (
        <Spring type="slideUp" index={index}>
            <StyledAccordion expanded={expanded === index} onChange={handleChange(index)}>
                <StyledAccordionSummary>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    <p>Text</p>
                    <img src={preview} alt="preview"/>
                </StyledAccordionDetails>
            </StyledAccordion>
        </Spring>
    )
}

export default FinanzItem