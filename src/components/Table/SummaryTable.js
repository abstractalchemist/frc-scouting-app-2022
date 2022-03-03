import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useExpanded } from "react-table";
import SampleData from "./Data";
import TeamTable from "./TeamTable";
import TestTable from './Test';
import api from '../../api';

const SummaryTable = () => {

    const [teamNumbers, setTeamNumbers] = useState([]);     // List of teamNumbers from Blue Alliance
    const [teamData, setTeamData] = useState([]);           // List of teamData from API

    useEffect(() => {                                       // Sets teamNumbers state to the data
        getTeams()
            .then(data => {
                setTeamNumbers(data);
            })
    }, [])

    useEffect(() => {
        api.get()
            .then(data => {
                setTeamData(data)
            })
    }, [teamNumbers])


    const getTeams = async () => {

        return await fetch('https://www.thebluealliance.com/api/v3/event/2022hiho/teams', { mode: "cors", headers: { 'X-TBA-Auth-Key': 'B9xCtlRyJheUGvzJShpl1QkOor35UTPO8GUtpn7Uq9xB5aJQL44yNzXnTZBHpWXz' } })
            .then(response => response.json())
            .then(data => {
                return data.map(obj => {
                    return {
                        TeamNumber: obj.team_number,
                        Strategy: '',
                        AveragePoints: 0,
                        AverageLowHubShots: 0,
                        AverageLowHubAccuracy: 0,
                        AverageUpperHubShots: 0,
                        AverageUpperHubAccuracy: 0,
                        AverageHangar: 0,
                    };
                });
            })
            .catch(err => console.log(err))
    }

    const data = React.useMemo(
        () => teamNumbers.map(team => {
            //let teamStats = teamData.filter(x => x.TeamNumber === team.TeamNumber);
            let teamStats = teamData.filter(x => x.TeamNumber === team.TeamNumber);

            let individualPoints = teamStats.map(value => value.TotalPoints)
            let totalPoints = 0;
            for (let i = 0; i < individualPoints.length; i++) {
                totalPoints = totalPoints + individualPoints[i]
            }
            let averagePoints = totalPoints / individualPoints.length;

            let stratList = [];
            teamStats.forEach(teamObject => {
                let strats = teamObject.Strategy;
                if (strats[0] === true && !stratList.includes("Low Hub Shooter")) {
                    stratList.push("Low Hub Shooter")
                }
                if (strats[1] === true && !stratList.includes("Upper Hub Shooter")) {
                    stratList.push("Upper Hub Shooter")
                }
                if (strats[2] === true && !stratList.includes("Launchpad User")) {
                    stratList.push("Launchpad User")
                }
                if (strats[3] === true && !stratList.includes("Hangar")) {
                    stratList.push("Hangar")
                }
                if (strats[4] === true && !stratList.includes("Defense")) {
                    stratList.push("Defense")
                }
            })

            let lowAccuracies = teamStats.map(value => value.LowHubAccuracy)
            let sumLowAccuracies = 0;
            for (let i = 0; i < lowAccuracies.length; i++) {
                sumLowAccuracies = sumLowAccuracies + lowAccuracies[i];
            }
            let averageLowAccuracy = sumLowAccuracies / lowAccuracies.length;

            let lowShots = teamStats.map(value => (value.AutoLowMade + value.TeleLowMade));
            let sumLowShots = 0;
            for (let i = 0; i < lowShots.length; i++) {
                sumLowShots = sumLowShots + lowShots[i];
            }
            let averageLowShots = sumLowShots / lowShots.length;

            let upperAccuracies = teamStats.map(value => value.UpperHubAccuracy);
            let sumHighAccuracies = 0;
            for (let i = 0; i < upperAccuracies.length; i++) {
                sumHighAccuracies = sumHighAccuracies + upperAccuracies[i];
            }
            let averageUpperAccuracy = sumHighAccuracies / upperAccuracies.length;

            let upperShots = teamStats.map(value => (value.AutoUpperMade + value.TeleUpperMade));
            let sumUpperShots = 0;
            for (let i = 0; i < upperShots.length; i++) {
                sumUpperShots = sumUpperShots + upperShots[i];
            }
            let averageUpperShots = sumUpperShots / upperShots.length;

            let hangar = teamStats.map(value => {
                if (value.hangar === 'None' || value.Hangar === 'Attempted') {
                    return 0;
                } else if (value.hangar === 'Low') {
                    return 4;
                } else if (value.hangar === 'Mid') {
                    return 6;
                } else if (value.hangar === 'High') {
                    return 10;
                } else if (value.hangar === 'Traversal') {
                    return 15;
                } else {
                    return 0;
                }
            });
            let sumHangar = 0;
            for (let i = 0; i < hangar.length; i++) {
                sumHangar = sumHangar + hangar[i];
            }
            let averageHangar = sumHangar / hangar.length;


            return {
                TeamNumber: team.TeamNumber,
                Strategy: stratList.join(', '),
                AveragePoints: !isNaN(averagePoints) ? averagePoints : '',
                AverageLowHubShots: !isNaN(averageLowShots) ? averageLowShots : '',
                AverageLowHubAccuracy: !isNaN(averageLowAccuracy) ? averageLowAccuracy + '%' : '',
                AverageUpperHubShots: !isNaN(averageUpperShots) ? averageUpperShots : '',
                AverageUpperHubAccuracy: !isNaN(averageUpperAccuracy) ? averageUpperAccuracy + '%' : '',
                AverageHangar: !isNaN(averageHangar) ? averageHangar : '',
            };

        }), [teamData]
    )


    const columns = React.useMemo(
        () => [
            {
                id: 'exp',
                Header: () => null,
                accessor: 'TeamNumber',
                Cell: ({ row }) =>
                (
                    <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? '-' : '+'}
                    </span>
                ),
            },
            {
                Header: 'Team #',
                accessor: 'TeamNumber'
            },
            {
                Header: 'Priority / Strategy',
                accessor: 'Strategy'
            },
            {
                Header: 'Average Points',
                accessor: 'AveragePoints',
            },
            {
                Header: 'Average Low Hub',
                accessor: 'AverageLowHubShots',
            },
            {
                Header: 'Average Low Hub Accuracy',
                accessor: 'AverageLowHubAccuracy',
            },
            {
                Header: 'Average Upper Hub',
                accessor: 'AverageUpperHubShots',
            },
            {
                Header: 'Average Upper Hub Accuracy',
                accessor: 'AverageUpperHubAccuracy',
            },
            {
                Header: 'Average Hangar Points',
                accessor: 'AverageHangar',
            },
        ],
        []
    )

    const renderRowSubComponent =
        ({ row }) => {

            console.log( row.values.TeamNumber )

            let info = teamData.filter((x) => x.TeamNumber === row.values.TeamNumber)

            return ((
                <pre>
                    <div> {<TestTable information={info}/>} </div>
                </pre>
            ));
        }

    const tableInstance = useTable({ columns, data }, useSortBy, useExpanded);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
    } = tableInstance


    return (
        <div>
            <table {...getTableProps()} >

                <thead>
                    {
                        headerGroups.map(headerGroup =>
                        (
                            <tr {...headerGroup.getHeaderGroupProps()} >
                                {
                                    headerGroup.headers.map(column =>
                                    (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    )
                                    )
                                }
                            </tr>
                        )
                        )
                    }
                </thead>

                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)

                            return (<React.Fragment  >

                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    style={{
                                                        padding: '10px',
                                                        border: 'solid 1px black',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {cell.render('Cell')}

                                                </td>
                                            )
                                        }
                                        )
                                    }
                                </tr>

                                {row.isExpanded ? (
                                    <tr>
                                        <td colSpan={visibleColumns.length}>
                                            {renderRowSubComponent({ row })}
                                        </td>
                                    </tr>
                                ) : null}


                            </React.Fragment>
                            )
                        }
                        )
                    }
                </tbody>

            </table>

        </div>
    )

}

export default SummaryTable;