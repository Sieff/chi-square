/*
 * ORIGINAL NAME
 *
 * statistics-distributions.js - JavaScript library for calculating
 *   critical values and upper probabilities of common statistical
 *   distributions
 *
 * SYNOPSIS
 *
 *   // Chi-squared-crit (2 degrees of freedom, 95th percentile = 0.05 level
 *   chisqrdistr(2, .05)
 *
 * DESCRIPTION
 *
 * This is an excerpt of a Library, that calculates critical values for statistical tests.
 * Here we can calculate the critical value for a chi-square test.
 *
 * BUGS
 *
 * This port was produced from the Perl module Statistics::Distributions
 * that has had no bug reports in several years.  If you find a bug then
 * please double-check that JavaScript does not thing the numbers you are
 * passing in are strings.  (You can subtract 0 from them as you pass them
 * in so that "5" is properly understood to be 5.)  If you have passed in a
 * number then please contact the author
 *
 * ORIGINAL AUTHOR
 *
 * Ben Tilly <btilly@gmail.com>
 *
 * Originl Perl version by Michael Kospach <mike.perl@gmx.at>
 *
 * Nice formating, simplification and bug repair by Matthias Trautner Kromann
 * <mtk@id.cbs.dk>
 *
 * COPYRIGHT
 *
 * Copyright 2008 Ben Tilly.
 *
 * This library is free software; you can redistribute it and/or modify it
 * under the same terms as Perl itself.  This means under either the Perl
 * Artistic License or the GPL v1 or later.
 */

function chiSquareCriticalValue (alpha: number, dof: number): number {
    if (dof <= 0 || Math.abs(dof) - Math.abs(integer(dof)) !== 0) {
        throw(Error("Invalid degree of freedom\n"));
    }
    if (alpha <= 0 || alpha > 1) {
        throw(Error("Invalid alpha\n"));
    }
    return _subchisqr(dof-0, alpha-0);
}

function _subuprob ($x: number) {
    var $p = 0; /* if ($absx > 100) */
    var $absx = Math.abs($x);

    if ($absx < 1.9) {
        $p = Math.pow((1 +
            $absx * (.049867347
                + $absx * (.0211410061
                    + $absx * (.0032776263
                        + $absx * (.0000380036
                            + $absx * (.0000488906
                                + $absx * .000005383)))))), -16)/2;
    } else if ($absx <= 100) {
        for (var $i = 18; $i >= 1; $i--) {
            $p = $i / ($absx + $p);
        }
        $p = Math.exp(-.5 * $absx * $absx)
            / Math.sqrt(2 * Math.PI) / ($absx + $p);
    }

    if ($x<0)
        $p = 1 - $p;
    return $p;
}

function _subu ($p: number) {
    var $y = -Math.log(4 * $p * (1 - $p));
    var $x = Math.sqrt(
        $y * (1.570796288
            + $y * (.03706987906
                + $y * (-.8364353589E-3
                    + $y *(-.2250947176E-3
                        + $y * (.6841218299E-5
                            + $y * (0.5824238515E-5
                                + $y * (-.104527497E-5
                                    + $y * (.8360937017E-7
                                        + $y * (-.3231081277E-8
                                            + $y * (.3657763036E-10
                                                + $y *.6936233982E-12)))))))))));
    if ($p>.5)
        $x = -$x;
    return $x;
}

function _subchisqr (dof: number, alpha: number) {
    var $x;

    if ((alpha > 1) || (alpha <= 0)) {
        throw(Error("Invalid alpha\n"));
    } else if (alpha == 1){
        $x = 0;
    } else if (dof == 1) {
        $x = Math.pow(_subu(alpha / 2), 2);
    } else if (dof == 2) {
        $x = -2 * Math.log(alpha);
    } else {
        var $u = _subu(alpha);
        var $u2 = $u * $u;

        $x = max(0, dof + Math.sqrt(2 * dof) * $u
            + 2/3 * ($u2 - 1)
            + $u * ($u2 - 7) / 9 / Math.sqrt(2 * dof)
            - 2/405 / dof * ($u2 * (3 *$u2 + 7) - 16));

        if (dof <= 100) {
            var $x0;
            var $p1;
            var $z;
            do {
                $x0 = $x;
                if ($x < 0) {
                    $p1 = 1;
                } else if (dof>100) {
                    $p1 = _subuprob((Math.pow(($x / dof), (1/3)) - (1 - 2/9/dof))
                        / Math.sqrt(2/9/dof));
                } else if ($x>400) {
                    $p1 = 0;
                } else {
                    var $i0
                    var $a;
                    if ((dof % 2) != 0) {
                        $p1 = 2 * _subuprob(Math.sqrt($x));
                        $a = Math.sqrt(2/Math.PI) * Math.exp(-$x/2) / Math.sqrt($x);
                        $i0 = 1;
                    } else {
                        $p1 = $a = Math.exp(-$x/2);
                        $i0 = 2;
                    }

                    for (var $i = $i0; $i <= dof-2; $i += 2) {
                        $a *= $x / $i;
                        $p1 += $a;
                    }
                }
                $z = Math.exp(((dof-1) * Math.log($x/dof) - Math.log(4*Math.PI*$x)
                    + dof - $x - 1/dof/6) / 2);
                $x += ($p1 - alpha) / $z;
                $x = round_to_precision($x, 5);
            } while ((dof < 31) && (Math.abs($x0 - $x) > 1e-4));
        }
    }
    return $x;
}

function max (...args: number[]) {
    var $max = args[0];
    for (let i = 0; i < args.length; i++) {
        if ($max < args[i])
            $max = args[i];
    }
    return $max;
}

function round_to_precision ($x: number, $p: number) {
    $x = $x * Math.pow(10, $p);
    $x = Math.round($x);
    return $x / Math.pow(10, $p);
}

function integer ($i: number) {
    if ($i > 0)
        return Math.floor($i);
    else
        return Math.ceil($i);
}

export {chiSquareCriticalValue};