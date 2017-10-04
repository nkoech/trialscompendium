/**
 * Slugify Filter
 * Convert alphanumeric characters to lowercase and replace spaces with hyphens
 * Usage: {{string | slugify}}
 **/

angular
    .module('app.core')
    .filter('slugify', slugify);

function slugify() {
    return slugifyFilter;
    function slugifyFilter(input) {
        if (!input) return;
        var slug = input.toLowerCase().trim();
        slug = slug.replace(/[^a-z0-9\s-]/g, ' ');
        slug = slug.replace(/[\s-]+/g, '-');
        return slug;
    }
}
