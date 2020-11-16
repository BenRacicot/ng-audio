Example forms and layout rules


# example markup:


<!-- centering as used in login & register pages -->
<main>
<section class="form">
<div class="form-container">
<!-- / centering -->

<form>

    /* ------------------------------------------------------------------------ *  
        text input fields
    * ------------------------------------------------------------------------ */
    <label for="first">
        <div class="input-group">
            <span>descrip</span> <!-- always floats above input-->
            <div class="input-group">
                <input type='text' id='first'/>
            </div>
        </div>
    </label>
    <!-- ALTERNATE STYLE .floatlabel-->
    <label for="second" class="floatlabel">
        <div class="input-group">
            <span>descrip</span>
            <div class="input-group">
                <input type='text' id='second'/>
            </div>
        </div>
    </label>

    /* ------------------------------------------------------------------------ *  
        Checkboxes
    * ------------------------------------------------------------------------ */
    <div class="input-group">
        <input id="placement" type="checkbox" value="placement">
        <label for="placement">{{firstName}} helped me get hired.</label>
    </div>

    // align a checkbox to the right of button
    <div class="input-group">
        <button class="btn btn__blue" type="submit">Create Review</button>
        <input id="placement" type="checkbox" value="placement">
        <label for="placement">{{firstName}} helped me get hired.</label>
    </div>





</form>
</main>
