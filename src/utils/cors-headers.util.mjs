export function corsHeaders() {
    return {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,User-Agent',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
    }
}
