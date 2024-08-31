// components
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import MatchesSegmentChart from '@widgets/MatchesSegmentChart';
import LiveMatches from '@widgets/LiveMatches';
import TeamStatsSlider from '@widgets/TeamStatsSlider';
import MonthMatches from '@widgets/MonthMatches';
import MatchResultColor from '@widgets/MatchResultColor';
import RefMatches from "@widgets/RefMatches";

const widgets = {
    month_matches: <RefMatches />,
}

const Championships = () => {
    return (
        <>
            <PageHeader title="Spielplan Übersicht" />
            <AppGrid id="matchesOverview" widgets={widgets} />
        </>
    )
}

export default Championships