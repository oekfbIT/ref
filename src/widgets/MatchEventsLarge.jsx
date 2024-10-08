// styling
import styled from 'styled-components/macro';

// components
import Spring from '@components/Spring';
import ClubInfo from '@components/ClubInfo';
import Score from '@ui/Score';
import MatchTrack from '@ui/MatchTrack';
import MatchEventText from '@ui/MatchEventText';
import MatchProgress from '@ui/MatchProgress';

// hooks
import useMeasure from 'react-use-measure';

const Header = styled.div`
  .main {
    display: none;
    
    // tablet portrait
    @media screen and (min-width: 768px) {
        display: flex;
    }
  }
`;

const MatchEventsLarge = () => {
    const [ref, {width}] = useMeasure();

    const events = [
        {type: 'goal', minute: 6, count: 1},
        {type: 'goal', minute: 14, count: 1},
        {type: 'substitution', minute: 20, count: 2},
        {type: 'goal', minute: 11, count: 1},
        {type: 'goal', minute: 2, count: 1},
        {type: 'substitution', minute: 23, count: 2},
    ]

    return (
        <Spring className="card d-flex flex-column">
            <Header className="d-flex align-items-center justify-content-between card-padded p-relative">
                <ClubInfo id="bayern"/>
                <Score team1={0} team2={2}/>
                <ClubInfo id="barcelona" wrapperClass="flex-row-reverse text-right"/>
            </Header>
            <div className="d-flex flex-column g-20 flex-1 p-relative card-padded"
                 ref={ref}
                 style={{paddingTop: 20}}>
                <MatchProgress currentMinute={20} containerWidth={width}/>
                <MatchEventText minute={20} text="Bayern attacks on the left"/>
                <MatchTrack events={events} currentMinute={20}/>
            </div>
        </Spring>
    )
}

export default MatchEventsLarge