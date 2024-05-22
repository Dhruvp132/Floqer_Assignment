const csv = require('csv-parser');
const fs = require('fs');

const getSalaries = async (req, res) => {
    const results = [];
    fs.createReadStream('./data/salaries.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const summary = {};
            results.forEach(row => {
                const year = row.work_year;
                const salary = parseFloat(row.salary_in_usd);
                if (!summary[year]) {
                    summary[year] = { totalJobs: 0, totalSalary: 0 };
                }
                summary[year].totalJobs += 1;
                summary[year].totalSalary += salary;
            });
            const summaryArray = Object.keys(summary).map(year => ({
                year: year,
                totalJobs: summary[year].totalJobs,
                averageSalary: summary[year].totalSalary / summary[year].totalJobs
            }));
            res.json(summaryArray);
        });
};


const lineDataGraph = async (req, res) => {
    const results = [];
    fs.createReadStream('./data/salaries.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const summary = {};
            results.forEach(row => {
                const year = row.work_year;
                if (!summary[year]) {
                    summary[year] = 0;
                }
                summary[year]++;
            });
            const lineChartData = Object.keys(summary).map(year => ({
                year: parseInt(year),
                totalJobs: summary[year]
            }));
            res.json(lineChartData);
        });
};

const jobTitlesByYear = async (req, res) => {
    const year = req.query.year;
    const results = [];
    fs.createReadStream('./data/salaries.csv')
        .pipe(csv())
        .on('data', (data) => {
            if (data.work_year === year) {
                results.push(data.job_title);
            }
        })
        .on('end', () => {
            const jobTitleCounts = {};
            results.forEach(jobTitle => {
                if (!jobTitleCounts[jobTitle]) {
                    jobTitleCounts[jobTitle] = 0;
                }
                jobTitleCounts[jobTitle]++;
            });
            const aggregatedJobTitles = Object.keys(jobTitleCounts).map(jobTitle => ({
                jobTitle,
                count: jobTitleCounts[jobTitle]
            }));
            res.json(aggregatedJobTitles);
        });
};

module.exports = { getSalaries, lineDataGraph, jobTitlesByYear };