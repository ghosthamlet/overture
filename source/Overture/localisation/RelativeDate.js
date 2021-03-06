// -------------------------------------------------------------------------- \\
// File: RelativeDate.js                                                      \\
// Module: Localisation                                                       \\
// Author: Neil Jenkins                                                       \\
// License: © 2010-2014 FastMail Pty Ltd. MIT Licensed.                       \\
// -------------------------------------------------------------------------- \\

"use strict";

( function ( NS ) {

/**
    Function: Date.formatDuration

    Formats the duration given into a localised string, e.g. "5 hours" or
    "3 weeks 2 days".

    Parameters:
        durationInMS - The duration in milliseconds to format.
        approx       - If true, only show most significant unit.

    Returns:
        {String} The formatted duration.
*/
var formatDuration = Date.formatDuration = function ( durationInMS, approx ) {
    var durationInSeconds = Math.abs( Math.floor( durationInMS / 1000 ) ),
        time, weeks, days, hours, minutes;

    if ( durationInSeconds < 60 ) {
        time = NS.loc( 'less than a minute' );
    } else if ( durationInSeconds < 60 * 60 ) {
        time = NS.loc( '[*2,_1,%n minute,%n minutes]',
            ~~( durationInSeconds / 60 ) );
    } else if ( durationInSeconds < 60 * 60 * 24 ) {
        if ( approx ) {
            hours = Math.round( durationInSeconds / ( 60 * 60 ) );
            minutes = 0;
        } else {
            hours = ~~( durationInSeconds / ( 60 * 60 ) );
            minutes = ~~( ( durationInSeconds / 60 ) % 60 );
        }
        time = NS.loc( '[*2,_1,%n hour,%n hours,] [*2,_2,%n minute,%n minutes,]', hours, minutes );
    } else if ( approx ? durationInSeconds < 60 * 60 * 24 * 21 :
            durationInSeconds < 60 * 60 * 24 * 7 ) {
        if ( approx ) {
            days = Math.round( durationInSeconds / ( 60 * 60 * 24 ) );
            hours = 0;
        } else {
            days = ~~( durationInSeconds / ( 60 * 60 * 24 ) );
            hours = ~~( ( durationInSeconds / ( 60 * 60 ) ) % 24 );
        }
        time = NS.loc( '[*2,_1,%n day,%n days,] [*2,_2,%n hour,%n hours,]',
            days, hours );
    } else {
        if ( approx ) {
            weeks = Math.round( durationInSeconds / ( 60 * 60 * 24 * 7 ) );
            days = 0;
        } else {
            weeks = ~~( durationInSeconds / ( 60 * 60 * 24 * 7 ) );
            days = ~~( durationInSeconds / ( 60 * 60 * 24 ) ) % 7;
        }
        time = NS.loc( '[*2,_1,%n week,%n weeks,] [*2,_2,%n day,%n days,]',
            weeks, days );
    }
    return time.trim();
};

Date.implement({
    /**
        Method: Date#relativeTo

        Returns the difference in time between the date given in the sole
        argument (or now if not supplied) and this date, in a human friendly,
        localised form. e.g. 5 hours 3 minutes ago.

        Parameters:
            date   - {Date} Date to compare it to.
            approx - {Boolean} (optional) If true, only return a string for the
                     most significant part of the relative time (e.g. just "5
                     hours ago" instead of "5 hours 34 mintues ago").

        Returns:
            {String} Relative date string.
    */
    relativeTo: function ( date, approx ) {
        if ( !date ) { date = new Date(); }

        var duration = ( date - this ),
            isFuture = ( duration < 0 ),
            time, years, months;

        if ( isFuture ) {
            duration = -duration;
        }
        // Less than a day
        if ( duration < 1000 * 60 * 60 * 24 ) {
            time = formatDuration( duration, approx );
        }
        // Less than 6 weeks
        else if ( duration < 1000 * 60 * 60 * 24 * 7 * 6 ) {
            if ( approx ) {
                duration = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ) - new Date(
                    this.getFullYear(),
                    this.getMonth(),
                    this.getDate()
                );
            }
            time = formatDuration( duration, approx );
        }
        else {
            years = date.getFullYear() - this.getFullYear();
            months = date.getMonth() - this.getMonth();

            if ( isFuture ) {
                years = -years;
                months = -months;
            }
            if ( months < 0 ) {
                years -= 1;
                months += 12;
            }
            time =
                NS.loc( '[*2,_1,%n year,%n years,] [*2,_2,%n month,%n months,]',
                    years, months ).trim();
        }

        return isFuture ?
            NS.loc( '[_1] from now', time ) : NS.loc( '[_1] ago', time );
    }
});

}( O ) );
