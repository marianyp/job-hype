# JobHype

## What is JobHype?

JobHype is a web app that gives users a rough estimate of which days companies post the most jobs. Many factors contribute to job posting trends, including the career field, the job board used, and duplicate job postings. Because of this, the returned data is generalized and should only be treated as a rough estimate.

## How are Trend Series Computed?

JobHype's API accepts requests containing a job title. The API then proceeds to:

1. Fetch batches of jobs from several third-party APIs that contain aggregated job postings.
2. Buckets each job posting into a time bucket, a string of text representing a date.
3. Counts jobs per bucket for each third-party API.
4. Computes the maximum bucket count across all buckets.
5. Normalizes the series by mapping each bucket’s index to a **percent of the mean** across all buckets.

## What Does the Index Mean?

The bucket index, more commonly referred to as the **Job Activity Index**, is normalized using the following formula:

    normalizedIndex = round((rawIndex / mean(rawIndexes)) * 100).

This normalized index represents relative posting activity. This approach emphasizes trends (increases or decreases over time) rather than raw posting totals.

### Example Values

- `100` = average posting volume for the sampled range
- `200` = double the average
- `50` = half the average
- `0` = insufficient data
