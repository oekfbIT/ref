// components
import PageHeader from '@layout/PageHeader';
import AppGrid from '@layout/AppGrid';
import MonthMatches from "@widgets/MonthMatches";

const widgets = {
    month_matches: <MonthMatches />,
}

const Dashboard = () => {
    return (
        <>
            <PageHeader title="Dashboard"/>
            <AppGrid id="dashboard" widgets={widgets}/>
        </>
    )
}

export default Dashboard